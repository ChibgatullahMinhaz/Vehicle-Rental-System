import { Router } from "express";
import userRouter from "../modules/users/users.routes";
import authRoutes from "../modules/auth/auth.routes";
import VehiclesRoutes from "../modules/Vehicles/vehicles.routes";
import bookingRoutes from "../modules/bookings/booking.routes";

const router = Router();
router.use("/users", userRouter);
router.use("/auth", authRoutes);
router.use("/vehicles", VehiclesRoutes);
router.use('/bookings', bookingRoutes)
export default router;
