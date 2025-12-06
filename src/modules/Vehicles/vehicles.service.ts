import { Result } from "pg";
import { pool } from "../../config/db";
import { VehiclePayload } from "./vehilse.type";
import { validate as isUUID } from "uuid";

export const vehicleService = {
  async create(payload: VehiclePayload) {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = payload;

    const allowedTypes = ["car", "bike", "van", "suv"];
    if (!allowedTypes.includes(type.toLowerCase())) {
      throw new Error("Invalid vehicle type");
    }
    const allowedStatus = ["available", "booked"];
    if (!allowedStatus.includes(availability_status.toLowerCase())) {
      throw new Error("Invalid availability status");
    }

    const isExists = await pool.query(
      ` SELECT * FROM Vehicles  WHERE registration_number =$1`,
      [registration_number]
    );

    if (isExists.rows.length > 0) {
      throw new Error("Vehicle already exists with same registration number");
    }
    const result = await pool.query(
      `
    INSERT INTO Vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5)  RETURNING *
    `,
      [
        vehicle_name,
        type.toLowerCase(),
        registration_number,
        daily_rent_price,
        availability_status.toLowerCase(),
      ]
    );

    return result.rows[0];
  },
  async getAll() {
    const result = await pool.query(
      `SELECT * FROM Vehicles ORDER BY created_at DESC `
    );
    return result.rows;
  },

  //* Get Vehicle by ID
  async getOne(vehicleId: string) {
    if (!vehicleId) {
      throw new Error("Vehicle ID is required");
    }
    if (!isUUID(vehicleId)) {
      throw new Error("Invalid vehicle ID");
    }
    const result = await pool.query(`SELECT * FROM Vehicles  WHERE id =$1`, [
      vehicleId,
    ]);

    return result.rows[0] || null;
  },

  async deleteOne(vehicleId: string) {
    if (!vehicleId) {
      throw new Error("Vehicle ID is required");
    }
    if (!isUUID(vehicleId)) {
      throw new Error("Invalid vehicle ID");
    }
    const result = await pool.query(
      `DELETE FROM  Vehicles WHERE id =$1 RETURNING *`,
      [vehicleId]
    );
    if (result.rows.length === 0) {
      throw new Error("Vehicle not found");
    }
    return result.rows[0];
  },

  //*Update Vehicle
  async updateVehicle(vehicleId: string, payload: Record<string, any>) {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = payload;

    if (!vehicleId) {
      throw new Error("Vehicle ID is required");
    }
    if (!isUUID(vehicleId)) {
      throw new Error("Invalid vehicle ID");
    }

    const isExists = await pool.query(` SELECT * FROM Vehicles WHERE id = $1`, [
      vehicleId,
    ]);
    if (isExists.rows.length === 0) {
      throw new Error("Vehicle not found");
    }

    const allowedTypes = ["car", "bike", "van", "suv"];
    const allowedStatus = ["available", "booked"];

    if (type && !allowedTypes.includes(type.toLowerCase())) {
      throw new Error("Invalid vehicle type");
    }

    if (
      availability_status &&
      !allowedStatus.includes(availability_status.toLowerCase())
    ) {
      throw new Error("Invalid availability status");
    }
    if (
      daily_rent_price &&
      (typeof daily_rent_price !== "number" || daily_rent_price <= 0)
    ) {
      throw new Error("Invalid daily rent price");
    }

    const result = await pool.query(
      `UPDATE Vehicles SET  vehicle_name=$1,
      type =$2,
      registration_number =$3,
      daily_rent_price =$4,
      availability_status =$5 WHERE id=$6 RETURNING *`,
      [
        vehicle_name,
        type.toLowerCase(),
        registration_number,
        daily_rent_price,
        availability_status.toLowerCase(),
        vehicleId,
      ]
    );

    return result.rows[0];
  },
};
