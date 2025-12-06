import { Request, Response } from "express";
import HttpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { vehicleService } from "./vehicles.service";
export const createVehicle = async (req: Request, res: Response) => {
  const data = req.body;
  if (!data) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: "Vehicle payload cannot be empty or undefine",
      errors: "Vehicle payload cannot be empty or undefine",
    });
  }

  try {
    const result = await vehicleService.create(data);
    sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (error: any) {
    let status: number = HttpStatus.BAD_REQUEST;

    if (error.message.includes("already exists")) status = HttpStatus.CONFLICT;
    if (error.message.includes("Invalid")) status = HttpStatus.BAD_REQUEST;

    return res.status(status).json({
      success: false,
      message: error.message || "Failed to create vehicle",
      errors: error.message,
    });
  }
};
