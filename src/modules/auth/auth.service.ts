import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import config from "../../config/config";

const registration = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;
  console.log(payload);
  const salt = await bcrypt.genSalt(10);
  const hashPass = await bcrypt.hash(password as string, salt);
  const result = await pool.query(
    `INSERT INTO users(name, role, email, password, phone) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, role, email, hashPass, phone]
  );

  return result;
};

const login = async (email: string, password: string) => {
  const users = await pool.query(` SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (users.rows.length === 0) {
    return null;
  }
  const user = users.rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return false;
  }
  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role, id: user.id },
    config.jwtSecret as string,
    {
      expiresIn: "7d",
    }
  );

  return { token, user };
};
export const authService = {
  registration,
  login,
};
