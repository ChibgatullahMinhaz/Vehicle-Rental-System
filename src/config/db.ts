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
    role TEXT NOT NULL CHECK (role IN ('admin', 'customer')) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )`
  );
  console.log("user table is ready");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_name VARCHAR(200) NOT NULL ,
    type TEXT NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
    registration_number VARCHAR(50) NOT NULL UNIQUE ,
    daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
    availability_status TEXT NOT NULL CHECK (availability_status IN ('available', 'booked'))  DEFAULT 'available',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `);

  await pool.query(`
      CREATE TABLE IF NOT EXISTS Bookings(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id UUID REFERENCES Vehicles(id) ON DELETE CASCADE,
      rent_start_date DATE NOT NULL ,
      rent_end_date DATE NOT NULL CHECK (rent_end_date>rent_start_date),
      total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
      status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'returned'))
        DEFAULT 'active',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);
};

export default intiDB;
