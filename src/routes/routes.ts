import { Router } from "express";
import userRouter from "../modules/users/users.routes";
import authRoutes from "../modules/auth/auth.routes";
import VehiclesRoutes from "../modules/Vehicles/vehicles.routes";

const router = Router();
router.use("/users", userRouter);
router.use("/auth", authRoutes);
router.use("/vehicles", VehiclesRoutes);
export default router;
