import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
const getAll = async (req: Request, res: Response) => {

  try {
    const result = await 
     sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Vehicles retrieved successfully",
      data: result,
    });
  } catch (error) {}
};

export const userController = {
  getAll,
};
