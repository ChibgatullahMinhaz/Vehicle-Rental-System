import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { authService } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.registration(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Registration successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: true,
      message: error.message,
      data: null,
    });
  }
};

const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: true,
        message: "email and password cannot be empty",
        data: null,
      });
    }

    const result = await authService.login(email, password);
    if (!result) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: "User not found",
        data: null,
      });
    }

    return sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User Registration successfully",
      data: result,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: true,
      message: error.message,
      data: null,
    });
  }
};
export const authControllers = {
  createUser,
  userLogin,
};
