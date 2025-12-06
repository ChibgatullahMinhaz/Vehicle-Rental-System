import { pool } from "../../config/db";
export const usersService = {
  async getAllUsers() {
    const { rows } = await pool.query(
      `SELECT * FROM users ORDER BY created_at DESC`
    );
    return rows;
  },

};
