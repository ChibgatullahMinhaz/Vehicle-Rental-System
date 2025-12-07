"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAutoReturnJob = startAutoReturnJob;
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("../config/db");
const CRON_EXPRESSION = process.env.AUTO_RETURN_CRON || "*/1 * * * *";
const BATCH_SIZE = 50;
const ADVISORY_KEY = 123456;
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1000;
const logger = console;
async function processBatch(client) {
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
    if (!rows.length)
        return 0;
    for (const booking of rows) {
        const bookingId = booking.id;
        const vehicleId = booking.vehicle_id;
        // Mark booking as returned
        const updateBookingSql = `
      UPDATE bookings
      SET status = 'returned', updated_at = NOW()
      WHERE id = $1 AND status = 'active'
      RETURNING id
    `;
        const ub = await client.query(updateBookingSql, [bookingId]);
        if (ub.rows.length === 0) {
            logger.info(`Booking ${bookingId} already processed; skipping`);
            continue;
        }
        // Update vehicle availability if no other active bookings
        const activeBookings = await client.query(`SELECT id FROM bookings WHERE vehicle_id=$1 AND status='active'`, [vehicleId]);
        if (activeBookings.rows.length === 0) {
            await client.query(`UPDATE vehicles SET availability_status='available', updated_at=NOW() WHERE id=$1`, [vehicleId]);
        }
        logger.info(`Auto-returned booking ${bookingId}, vehicle ${vehicleId}`);
    }
    return rows.length;
}
async function runOnce() {
    const client = await db_1.pool.connect();
    try {
        // Acquire advisory lock to prevent overlapping jobs
        const lockRes = await client.query("SELECT pg_try_advisory_lock($1) as locked", [ADVISORY_KEY]);
        if (!lockRes.rows[0].locked) {
            logger.info("Auto-return job: another instance is running, skipping this run");
            return;
        }
        while (true) {
            await client.query("BEGIN");
            try {
                const processed = await processBatch(client);
                await client.query("COMMIT");
                if (!processed)
                    break;
            }
            catch (err) {
                await client.query("ROLLBACK");
                throw err;
            }
        }
    }
    finally {
        try {
            await client.query("SELECT pg_advisory_unlock($1)", [ADVISORY_KEY]);
        }
        catch (err) {
            logger.error("Failed to release advisory lock", err);
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
        }
        catch (err) {
            attempt++;
            const backoffMs = RETRY_BASE_MS * 2 ** (attempt - 1);
            logger.error(`Auto-return job failed attempt ${attempt}`, err);
            if (attempt > MAX_RETRIES)
                return;
            await new Promise(res => setTimeout(res, backoffMs));
        }
    }
}
function startAutoReturnJob() {
    if (global.__AUTO_RETURN_JOB_STARTED__)
        return;
    global.__AUTO_RETURN_JOB_STARTED__ = true;
    logger.info(`Scheduling auto-return job with cron: ${CRON_EXPRESSION}`);
    node_cron_1.default.schedule(CRON_EXPRESSION, async () => {
        logger.info("Auto-return job triggered by cron");
        await runWithRetries();
    });
}
