import { Request, Response } from "express";

const makeBooking = async (req: Request, res: Response) => {};

const getBookings = async (req: Request, res: Response) => {};
const updateBooking = async (req: Request, res: Response) => {};
export const bookingsControllers = {
  makeBooking,
  getBookings,
  updateBooking,
};
