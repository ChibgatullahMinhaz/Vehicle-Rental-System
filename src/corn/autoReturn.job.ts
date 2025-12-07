// src/jobs/autoReturn.job.ts
import cron from "node-cron";
import { pool } from "../config/db"; // your pg Pool export
import { logger } from "../utils/logger";
import { setTimeout } from "timers/promises";

/**
 * Production cron job to auto-mark bookings as returned when rent_end_date has passed.
 *
 * Features:
 * - Advisory lock (pg_try_advisory_lock) to ensure only one instance runs across multiple nodes.
 * - Batch processing with FOR UPDATE SKIP LOCKED to avoid race conditions.
 * - Transactional updates: booking.status + vehicle.availability_status in the same transaction.
 * - Exponential backoff retries on transient errors.
 * - Configurable cron schedule via env AUTO_RETURN_CRON (default: every minute).
 *
 * NOTE: Import this module once (e.g. in server.ts) to start the job.
 */

// Config
const CRON_EXPRESSION = process.env.AUTO_RETURN_CRON || "*/1 * * * *"; // default: every minute
const BATCH_SIZE = Number(process.env.AUTO_RETURN_BATCH_SIZE ?? 100); // how many bookings to process per transaction
const ADVISORY_KEY = Number(process.env.AUTO_RETURN_ADVISORY_KEY ?? 1234567890); // integer advisory lock key
const MAX_RETRIES = Number(process.env.AUTO_RETURN_MAX_RETRIES ?? 3);
const RETRY_BASE_MS = Number(process.env.AUTO_RETURN_RETRY_BASE_MS ?? 200); // initial backoff

async function processBatch(client: any) {
  // Select expired active bookings in a batch, lock them so other workers skip them.
  // We select columns we need only.
  const selectSql = `
    SELECT id, vehicle_id
    FROM bookings
    WHERE status = 'active'
      AND rent_end_date < NOW()
    ORDER BY rent_end_date ASC
    LIMIT $1
    FOR UPDATE SKIP LOCKED
  `;

  const { rows } = await client.query(selectSql, [BATCH_SIZE]);
  if (!rows.length) return 0;

  for (const booking of rows) {
    const bookingId = booking.id;
    const vehicleId = booking.vehicle_id;

    // Update booking.status and vehicle availability in one transaction (we are already inside a client transaction)
    // But for more safety we will execute specific UPDATE with WHERE status='active' to avoid double updates.
    const updateBookingSql = `
      UPDATE bookings
      SET status = 'returned', updated_at = NOW()
      WHERE id = $1 AND status = 'active'
      RETURNING id
    `;
    const updateVehicleSql = `
      UPDATE vehicles
      SET availability_status = 'available', updated_at = NOW()
      WHERE id = $1 AND availability_status = 'booked'
      RETURNING id
    `;

    // Update booking
    const ub = await client.query(updateBookingSql, [bookingId]);
    if (ub.rows.length === 0) {
      // booking already changed by someone else; skip
      logger.info(`Booking ${bookingId} skipped (no longer active)`);
      continue;
    }

    // Update vehicle
    const uv = await client.query(updateVehicleSql, [vehicleId]);
    if (uv.rows.length === 0) {
      // Vehicle might already be available; log a warning
      logger.warn(`Vehicle ${vehicleId} was not 'booked' when returning booking ${bookingId}`);
    }

    logger.info(`Auto-returned booking ${bookingId}, vehicle ${vehicleId}`);
  }

  return rows.length;
}

async function runOnce() {
  const client = await pool.connect();
  try {
    // Try to acquire advisory lock
    const lockRes = await client.query("SELECT pg_try_advisory_lock($1) as locked", [ADVISORY_KEY]);
    const locked = lockRes.rows?.[0]?.locked;
    if (!locked) {
      logger.info("Auto-return job: another instance is running. Skipping this run.");
      return;
    }

    logger.info("Auto-return job: acquired advisory lock");

    // Keep processing batches until none are left
    while (true) {
      try {
        await client.query("BEGIN");

        const processed = await processBatch(client);

        await client.query("COMMIT");

        if (!processed) {
          // no more expired bookings
          break;
        }

        // small sleep between batches to avoid DB thrash
        await setTimeout(50);
      } catch (innerErr) {
        await client.query("ROLLBACK");
        throw innerErr;
      }
    }
  } finally {
    try {
      // release advisory lock (ignore result)
      await client.query("SELECT pg_advisory_unlock($1)", [ADVISORY_KEY]);
    } catch (unlockErr) {
      logger.error("Auto-return job: failed to release advisory lock", unlockErr);
    }
    client.release();
  }
}

async function runWithRetries() {
  let attempt = 0;
  while (attempt <= MAX_RETRIES) {
    try {
      await runOnce();
      return;
    } catch (err: any) {
      attempt++;
      const backoffMs = RETRY_BASE_MS * 2 ** (attempt - 1);
      logger.error(`Auto-return job failed on attempt ${attempt}`, err);
      if (attempt > MAX_RETRIES) {
        logger.error("Auto-return job: exceeded max retries, giving up until next schedule run");
        return;
      }
      logger.info(`Auto-return job: retrying after ${backoffMs}ms`);
      await setTimeout(backoffMs);
    }
  }
}

// Start cron schedule
export function startAutoReturnJob() {
  // prevent multiple scheduler setups if module imported multiple times
  if ((global as any).__AUTO_RETURN_JOB_STARTED__) {
    logger.info("Auto-return job already started; skipping duplicate start.");
    return;
  }
  (global as any).__AUTO_RETURN_JOB_STARTED__ = true;

  logger.info(`Scheduling auto-return job with cron expression: ${CRON_EXPRESSION}`);
  cron.schedule(CRON_EXPRESSION, async () => {
    logger.info("Auto-return job triggered by cron");
    await runWithRetries();
  });
}

// auto-start when this module is imported (optional)
// If you prefer explicit start, comment out the next line and call startAutoReturnJob() from server.ts
startAutoReturnJob();
