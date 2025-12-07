"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingsControllers = void 0;
const booking_service_1 = require("./booking.service");
const makeBooking = async (req, res) => {
    try {
        const result = await booking_service_1.bookingService.make(req.body);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
const getBookings = async (req, res) => {
    try {
        const { role } = req.user;
        const result = await booking_service_1.bookingService.all(req.user);
        res.status(200).json({
            success: true,
            message: role && role === "admin"
                ? "Bookings retrieved successfully"
                : "Your bookings retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const updateBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        console.log(bookingId);
        const user = req.user;
        const result = await booking_service_1.bookingService.update(bookingId, req.body, user);
        res.status(200).json({
            success: true,
            message: result.status === "cancelled"
                ? "Booking cancelled successfully"
                : "Booking marked as returned. Vehicle is now available",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
exports.bookingsControllers = {
    makeBooking,
    getBookings,
    updateBooking,
};
