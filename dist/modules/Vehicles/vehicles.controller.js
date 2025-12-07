"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicles = exports.updateVehicle = exports.getOneVehicles = exports.getAllVehicles = exports.createVehicle = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const vehicles_service_1 = require("./vehicles.service");
const createVehicle = async (req, res) => {
    const data = req.body;
    if (!data) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "Vehicle payload cannot be empty or undefine",
            errors: "Vehicle payload cannot be empty or undefine",
        });
    }
    try {
        const result = await vehicles_service_1.vehicleService.create(data);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: "Vehicle created successfully",
            data: result,
        });
    }
    catch (error) {
        let status = http_status_1.default.BAD_REQUEST;
        if (error.message.includes("already exists")) {
            status = http_status_1.default.CONFLICT;
        }
        else if (error.message.includes("Invalid")) {
            status = http_status_1.default.BAD_REQUEST;
        }
        else {
            status = http_status_1.default.INTERNAL_SERVER_ERROR;
        }
        return res.status(status).json({
            success: false,
            message: error.message || "Failed to create vehicle",
            errors: error.message,
        });
    }
};
exports.createVehicle = createVehicle;
const getAllVehicles = async (req, res) => {
    try {
        const result = await vehicles_service_1.vehicleService.getAll();
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Vehicles retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || "Failed to create vehicle",
            errors: error.message,
        });
    }
};
exports.getAllVehicles = getAllVehicles;
const getOneVehicles = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const result = await vehicles_service_1.vehicleService.getOne(vehicleId);
        if (!result) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: `cannot fetch one  vehicle by id : ${vehicleId}`,
                errors: "not found",
            });
        }
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Vehicle retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        let status = http_status_1.default.NOT_FOUND;
        if (error.message.includes("required")) {
            status = http_status_1.default.BAD_REQUEST;
        }
        else if (error.message.includes("Invalid")) {
            status = http_status_1.default.BAD_REQUEST;
        }
        else {
            status = http_status_1.default.INTERNAL_SERVER_ERROR;
        }
        return res.status(status).json({
            success: false,
            message: `Failed to fetch one  vehicle by id`,
            errors: error.message,
        });
    }
};
exports.getOneVehicles = getOneVehicles;
const updateVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const result = await vehicles_service_1.vehicleService.updateVehicle(vehicleId, req.body);
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Vehicle updated successfully",
            data: result,
        });
    }
    catch (error) {
        let status = http_status_1.default.BAD_REQUEST;
        if (error.message.includes("required") ||
            error.message.includes("Invalid")) {
            status = http_status_1.default.BAD_REQUEST;
        }
        else if (error.message.includes("not found")) {
            status = http_status_1.default.NOT_FOUND;
        }
        else {
            status = http_status_1.default.INTERNAL_SERVER_ERROR;
        }
        return res.status(status).json({
            success: false,
            message: `Failed to update vehicle`,
            errors: error.message,
        });
    }
};
exports.updateVehicle = updateVehicle;
const deleteVehicles = async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const result = await vehicles_service_1.vehicleService.deleteOne(vehicleId);
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Vehicle deleted successfully",
            data: result,
        });
    }
    catch (error) {
        let status = http_status_1.default.BAD_REQUEST;
        if (error.message.includes("required") ||
            error.message.includes("Invalid")) {
            status = http_status_1.default.BAD_REQUEST;
        }
        else if (error.message.includes("active bookings exist")) {
            status = http_status_1.default.BAD_REQUEST;
        }
        else if (error.message.includes("not found")) {
            status = http_status_1.default.NOT_FOUND;
        }
        else {
            status = http_status_1.default.INTERNAL_SERVER_ERROR;
        }
        return res.status(status).json({
            success: false,
            message: `Failed to Delete`,
            errors: error.message,
        });
    }
};
exports.deleteVehicles = deleteVehicles;
