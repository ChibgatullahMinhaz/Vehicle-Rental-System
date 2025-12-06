import { Router } from "express";
import {
  createVehicle,
  deleteVehicles,
  getAllVehicles,
  getOneVehicles,
  updateVehicle,
} from "./vehicles.controller";
import { auth } from "../../middleware/auth";

const router = Router();

//* admin can access only.
router.post("/", auth("admin"), createVehicle);
router.get("/", getAllVehicles);
router.get("/:vehicleId", getOneVehicles);
router.put("/:vehicleId", auth("admin"), updateVehicle);
router.delete("/:vehicleId", auth("admin"), deleteVehicles);
const VehiclesRoutes = router;
export default VehiclesRoutes;
