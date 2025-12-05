import { Pool } from "pg";
import config from "./config";

export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const intiDB = async () => {
  console.log("db in initialized");
  await pool.query(
    `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE CHECK (email = LOWER(email)),
    password TEXT NOT NULL CHECK (char_length(password) >= 6),
    phone TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'customer')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )`
  );
  console.log("user table is ready");
};

export default intiDB;
