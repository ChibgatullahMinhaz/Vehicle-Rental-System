import { Response } from "express";
interface IResponseData<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  statusCode: number;
}
const sendResponse = <T = unknown>(res: Response, data: IResponseData<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};

export default sendResponse;
