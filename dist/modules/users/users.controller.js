"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const users_service_1 = require("./users.service");
const getAll = async (req, res) => {
    try {
        const result = await users_service_1.usersService.getAllUsers();
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Users retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
            errors: error.message,
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await users_service_1.usersService.deleteOne(userId);
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "User deleted successfully",
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
const updateUser = async (req, res) => {
    try {
        const data = req.body;
        const { userId } = req.params;
        const { role, email } = req?.user;
        if (!data) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                message: "payload cannot empty",
                errors: "payload is empty , add data on body",
            });
        }
        if (!userId) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                success: false,
                message: "userId is required",
                errors: "userId is required",
            });
        }
        let result;
        //* checked the role
        if (role === "admin") {
            result = await users_service_1.usersService.updateUser(userId, req.body);
        }
        else {
            result = await users_service_1.usersService.updateOwn(email, userId, req.body);
        }
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "User updated successfully",
            data: result,
        });
    }
    catch (error) {
        console.log(error);
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
        else if (error.message.includes("Access denied")) {
            status = http_status_1.default.FORBIDDEN;
        }
        else {
            status = http_status_1.default.INTERNAL_SERVER_ERROR;
        }
        return res.status(status).json({
            success: false,
            message: `Failed to update user details`,
            errors: error.message,
        });
    }
};
exports.userController = {
    getAll,
    deleteUser,
    updateUser,
};
