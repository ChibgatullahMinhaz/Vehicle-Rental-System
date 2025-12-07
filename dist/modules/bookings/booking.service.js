"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = void 0;
const db_1 = require("../../config/db");
exports.bookingService = {
    async make(payload) {
        const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
        if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
            throw new Error("All fields are required");
        }
        // 1. Fetch vehicle
        const vehicleRes = await db_1.pool.query(`SELECT * FROM Vehicles WHERE id = $1`, [vehicle_id]);
        if (vehicleRes.rows.length === 0) {
            throw new Error("Vehicle not found");
        }
        const vehicle = vehicleRes.rows[0];
        if (vehicle.availability_status === "booked") {
            throw new Error("Vehicle is not available");
        }
        const dailyPrice = vehicle.daily_rent_price;
        // 2. Parse dates
        const startDate = new Date(String(rent_start_date));
        const endDate = new Date(String(rent_end_date));
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error("Invalid date format");
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (startDate < today) {
            throw new Error("Rent start date cannot be in the past");
        }
        if (endDate <= startDate) {
            throw new Error("End date must be after start date");
        }
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        // 3. Check overlapping bookings
        const bookingOver = await db_1.pool.query(`
      SELECT 1 FROM Bookings
      WHERE vehicle_id = $1
      AND status = 'active'
      AND rent_start_date < $2
      AND rent_end_date > $3
    `, [vehicle_id, startDate.toISOString(), endDate.toISOString()]);
        if (bookingOver.rows.length > 0) {
            throw new Error("Vehicle already booked in this time range");
        }
        const total_price = dailyPrice * totalDays;
        // 4. Insert booking
        const bookingRes = await db_1.pool.query(`
      INSERT INTO Bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
    `, [
            customer_id,
            vehicle_id,
            startDate.toISOString(),
            endDate.toISOString(),
            total_price,
            "active",
        ]);
        const booking = bookingRes.rows[0];
        // 5. Update vehicle availability
        await db_1.pool.query(`UPDATE Vehicles SET availability_status = 'booked' WHERE id = $1`, [vehicle_id]);
        // 6. Return nested object
        return {
            ...booking,
            vehicle: {
                vehicle_name: vehicle.vehicle_name,
                daily_rent_price: dailyPrice,
            },
        };
    },
    async all(user) {
        if (user.role === "admin") {
            // Admin সব booking দেখতে পারবে
            const { rows } = await db_1.pool.query(`
      SELECT 
        b.*,
        json_build_object('name', u.name, 'email', u.email) AS customer,
        json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) AS vehicle
      FROM Bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.created_at DESC
    `);
            return rows;
        }
        const { rows } = await db_1.pool.query(`
    SELECT 
      b.*,
      json_build_object('name', u.name, 'email', u.email) AS customer,
      json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) AS vehicle
    FROM Bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.created_at DESC
  `, [user.id]);
        return rows;
    },
    async own() { },
    async update(id, payload, user) {
        const { status } = payload;
        // Load booking
        const bookingData = await db_1.pool.query(`SELECT * FROM bookings WHERE id=$1`, [
            id,
        ]);
        if (bookingData.rows.length === 0)
            throw new Error("Booking not found");
        const booking = bookingData.rows[0];
        // Timezone-safe today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const rentStart = new Date(booking.rent_start_date);
        rentStart.setHours(0, 0, 0, 0);
        // ============= CUSTOMER CANCEL
        if (status === "cancelled") {
            if (user.role !== "customer") {
                throw new Error("Only customer can cancel booking");
            }
            if (today >= rentStart) {
                throw new Error("Cannot cancel after rent start date");
            }
            const updated = await db_1.pool.query(`UPDATE bookings SET status='cancelled' WHERE id=$1 RETURNING *`, [id]);
            // Vehicle status safe update
            const activeBookings = await db_1.pool.query(`SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'`, [booking.vehicle_id]);
            if (activeBookings.rows.length === 0) {
                await db_1.pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id]);
            }
            return {
                ...updated.rows[0],
                vehicle: {
                    availability_status: activeBookings.rows.length === 0
                        ? "available"
                        : booking.availability_status,
                },
            };
        }
        //============= ADMIN RETURN
        if (status === "returned") {
            if (user.role !== "admin") {
                throw new Error("Only admin can mark as returned");
            }
            const updated = await db_1.pool.query(`UPDATE bookings SET status='returned' WHERE id=$1 RETURNING *`, [id]);
            // Vehicle status safe update
            const activeBookings = await db_1.pool.query(`SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'`, [booking.vehicle_id]);
            if (activeBookings.rows.length === 0) {
                await db_1.pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id]);
            }
            return {
                ...updated.rows[0],
                vehicle: {
                    availability_status: activeBookings.rows.length === 0
                        ? "available"
                        : booking.availability_status,
                },
            };
        }
        throw new Error("Invalid status update");
    },
};
