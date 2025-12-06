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

    if (error.message.includes("already exists")) {
      status = HttpStatus.CONFLICT;
    } else if (error.message.includes("Invalid")) {
      status = HttpStatus.BAD_REQUEST;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(status).json({
      success: false,
      message: error.message || "Failed to create vehicle",
      errors: error.message,
    });
  }
};

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAll();
   return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Vehicles retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Failed to create vehicle",
      errors: error.message,
    });
  }
};

export const getOneVehicles = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const result = await vehicleService.getOne(vehicleId);
    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: `cannot fetch one  vehicle by id : ${vehicleId}`,
        errors: "not found",
      });
    }

    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Vehicle retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    let status: number = HttpStatus.NOT_FOUND;
    if (error.message.includes("required")) {
      status = HttpStatus.BAD_REQUEST;
    } else if (error.message.includes("Invalid")) {
      status = HttpStatus.BAD_REQUEST;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(status).json({
      success: false,
      message: `Failed to fetch one  vehicle by id`,
      errors: error.message,
    });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const result = await vehicleService.updateVehicle(vehicleId, req.body);

    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Vehicle updated successfully",
      data: result,
    });
  } catch (error: any) {
    let status: number = HttpStatus.BAD_REQUEST;
    if (
      error.message.includes("required") ||
      error.message.includes("Invalid")
    ) {
      status = HttpStatus.BAD_REQUEST;
    } else if (error.message.includes("not found")) {
      status = HttpStatus.NOT_FOUND;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return res.status(status).json({
      success: false,
      message: `Failed to update vehicle`,
      errors: error.message,
    });
  }
};

export const deleteVehicles = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const result = await vehicleService.deleteOne(vehicleId);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "Vehicle deleted successfully",
      data: result,
    });
  } catch (error: any) {
    let status: number = HttpStatus.BAD_REQUEST;
    if (
      error.message.includes("required") ||
      error.message.includes("Invalid")
    ) {
      status = HttpStatus.BAD_REQUEST;
    } else if (error.message.includes("active bookings exist")) {
      status = HttpStatus.BAD_REQUEST;
    } else if (error.message.includes("not found")) {
      status = HttpStatus.NOT_FOUND;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(status).json({
      success: false,
      message: `Failed to Delete`,
      errors: error.message,
    });
  }
};
