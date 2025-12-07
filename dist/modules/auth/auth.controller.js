"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllers = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const auth_service_1 = require("./auth.service");
const createUser = async (req, res) => {
    try {
        const result = await auth_service_1.authService.registration(req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: "User Registration successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            success: true,
            message: error.message,
            data: null,
        });
    }
};
const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.BAD_REQUEST,
                success: true,
                message: "email and password cannot be empty",
                data: null,
            });
        }
        const result = await auth_service_1.authService.login(email, password);
        if (!result) {
            return (0, sendResponse_1.default)(res, {
                statusCode: http_status_1.default.BAD_REQUEST,
                success: false,
                message: "User not found",
                data: null,
            });
        }
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: "User Registration successfully",
            data: result,
        });
    }
    catch (error) {
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.INTERNAL_SERVER_ERROR,
            success: true,
            message: error.message,
            data: null,
        });
    }
};
exports.authControllers = {
    createUser,
    userLogin,
};
