"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
//* roles is array of string like ['admin', 'customer']
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const authorization = req.headers.authorization;
            if (!authorization || !authorization.startsWith("Bearer ")) {
                return res.status(http_status_1.default.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid token",
                });
            }
            const [, token] = authorization?.split(" ");
            if (!token) {
                return res.status(http_status_1.default.BAD_REQUEST).json({
                    success: false,
                    message: "Token not found",
                });
            }
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
            req.user = decoded;
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(http_status_1.default.UNAUTHORIZED).json({
                    error: "unauthorized!!!",
                });
            }
            next();
        }
        catch (error) {
            res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message,
            });
        }
    };
};
exports.auth = auth;
