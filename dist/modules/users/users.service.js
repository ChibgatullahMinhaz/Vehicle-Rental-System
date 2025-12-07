"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const db_1 = require("../../config/db");
exports.usersService = {
    async getAllUsers() {
        const { rows } = await db_1.pool.query(`SELECT * FROM users ORDER BY created_at DESC`);
        return rows;
    },
    async deleteOne(userId) {
        if (!userId) {
            throw new Error("user ID is required");
        }
        // if (!isUUID(userId)) {
        //   throw new Error("Invalid user ID");
        // }
        const findBookings = await db_1.pool.query(`SELECT * FROM Bookings WHERE customer_id=$1 AND status=$2`, [userId, "active"]);
        if (findBookings.rows.length > 0) {
            throw new Error("Cannot delete user: active bookings exist");
        }
        const result = await db_1.pool.query(`DELETE FROM  users WHERE id =$1 RETURNING *`, [userId]);
        if (result.rows.length === 0) {
            throw new Error("user not found");
        }
        return result.rows[0];
    },
    async updateUser(userId, payload) {
        if (!userId) {
            throw new Error("Vehicle ID is required");
        }
        // if (!isUUID(userId)) {
        //   throw new Error("Invalid vehicle ID");
        // }
        const { name, email, phone, role } = payload;
        const isExists = await db_1.pool.query(`SELECT * FROM users WHERE id=$1`, [
            userId,
        ]);
        if (isExists.rows.length === 0) {
            throw new Error("User not found !");
        }
        const { rows } = await db_1.pool.query(`UPDATE users SET  name=$1,email=$2,phone=$3,role=$4 WHERE id=$5 RETURNING * `, [name, email, phone, role, userId]);
        return rows[0];
    },
    async updateOwn(userEmail, userId, payload) {
        if (!userId) {
            throw new Error("Vehicle ID is required");
        }
        // if (!isUUID(userId)) {
        //   throw new Error("Invalid vehicle ID");
        // }
        const { name, email, phone, role } = payload;
        if (role) {
            throw new Error("customer cannot update own role");
        }
        const isExists = await db_1.pool.query(`SELECT * FROM users WHERE id=$1`, [
            userId,
        ]);
        if (isExists.rows.length === 0) {
            throw new Error("User not found !");
        }
        const [foundUser] = isExists.rows;
        if (foundUser.email !== userEmail) {
            throw new Error("Access denied! You can update only your own account.");
        }
        const { rows } = await db_1.pool.query(`UPDATE users SET  name=$1,email=$2,phone=$3 WHERE id=$4 RETURNING * `, [name, email, phone, userId]);
        return rows[0];
    },
};
