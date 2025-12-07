"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vehicles_controller_1 = require("./vehicles.controller");
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
//* admin can access only.
router.post("/", (0, auth_1.auth)("admin"), vehicles_controller_1.createVehicle);
router.get("/", vehicles_controller_1.getAllVehicles);
router.get("/:vehicleId", vehicles_controller_1.getOneVehicles);
router.put("/:vehicleId", (0, auth_1.auth)("admin"), vehicles_controller_1.updateVehicle);
router.delete("/:vehicleId", (0, auth_1.auth)("admin"), vehicles_controller_1.deleteVehicles);
const VehiclesRoutes = router;
exports.default = VehiclesRoutes;
