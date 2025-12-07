"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_routes_1 = __importDefault(require("../modules/users/users.routes"));
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const vehicles_routes_1 = __importDefault(require("../modules/Vehicles/vehicles.routes"));
const booking_routes_1 = __importDefault(require("../modules/bookings/booking.routes"));
const router = (0, express_1.Router)();
router.use("/users", users_routes_1.default);
router.use("/auth", auth_routes_1.default);
router.use("/vehicles", vehicles_routes_1.default);
router.use('/bookings', booking_routes_1.default);
exports.default = router;
