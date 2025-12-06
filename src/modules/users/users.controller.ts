import { JwtPayload } from "./../../../node_modules/@types/jsonwebtoken/index.d";
import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { usersService } from "./users.service";
const getAll = async (req: Request, res: Response) => {
  try {
    const result = await usersService.getAllUsers();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
      errors: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const result = await usersService.deleteOne(userId);
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User deleted successfully",
      data: result,
    });
  } catch (error: any) {
    let status: number = httpStatus.BAD_REQUEST;
    if (
      error.message.includes("required") ||
      error.message.includes("Invalid")
    ) {
      status = httpStatus.BAD_REQUEST;
    } else if (error.message.includes("active bookings exist")) {
      status = httpStatus.BAD_REQUEST;
    } else if (error.message.includes("not found")) {
      status = httpStatus.NOT_FOUND;
    } else {
      status = httpStatus.INTERNAL_SERVER_ERROR;
    }

    return res.status(status).json({
      success: false,
      message: `Failed to Delete`,
      errors: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const { userId } = req.params;
    const { role, email } = req?.user as JwtPayload;

    if (!data) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "payload cannot empty",
        errors: "payload is empty , add data on body",
      });
    }
    if (!userId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "userId is required",
        errors: "userId is required",
      });
    }
    let result;

    //* checked the role
    if (role === "admin") {
      result = await usersService.updateUser(userId, req.body);
    } else {
      result = await usersService.updateOwn(email, userId, req.body);
    }
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    let status: number = httpStatus.BAD_REQUEST;
    if (
      error.message.includes("required") ||
      error.message.includes("Invalid")
    ) {
      status = httpStatus.BAD_REQUEST;
    } else if (error.message.includes("active bookings exist")) {
      status = httpStatus.BAD_REQUEST;
    } else if (error.message.includes("not found")) {
      status = httpStatus.NOT_FOUND;
    } else if (error.message.includes("Access denied")) {
      status = httpStatus.FORBIDDEN;
    } else {
      status = httpStatus.INTERNAL_SERVER_ERROR;
    }
    return res.status(status).json({
      success: false,
      message: `Failed to update user details`,
      errors: error.message,
    });
  }
};

export const userController = {
  getAll,
  deleteUser,
  updateUser,
};
