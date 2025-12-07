import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const makeBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.make(req.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const { role } = req.user as JwtPayload;

    const result = await bookingService.all(req.user);
    res.status(200).json({
      success: true,
      message:
        role && role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.id;
    const user = req.user;
    const result = await bookingService.update(
      bookingId as string,
      req.body,
      user
    );

    res.status(200).json({
      success: true,
      message:
        result.status === "cancelled"
          ? "Booking cancelled successfully"
          : "Booking marked as returned. Vehicle is now available",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const bookingsControllers = {
  makeBooking,
  getBookings,
  updateBooking,
};
