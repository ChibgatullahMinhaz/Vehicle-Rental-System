import { Router } from "express";
import { createVehicle } from "./vehicles.controller";
import { auth } from "../../middleware/auth";

const router = Router();

//* admin can access only.
router.post("/", auth("admin"), createVehicle);

const VehiclesRoutes = router;
export default VehiclesRoutes;
