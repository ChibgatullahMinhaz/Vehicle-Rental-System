"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../config/db");
const config_1 = __importDefault(require("../../config/config"));
const registration = async (payload) => {
    const { name, email, password, phone, role } = payload;
    console.log(payload);
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashPass = await bcryptjs_1.default.hash(password, salt);
    const result = await db_1.pool.query(`INSERT INTO users(name, role, email, password, phone) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, role, email, hashPass, phone]);
    return result;
};
const login = async (email, password) => {
    const users = await db_1.pool.query(` SELECT * FROM users WHERE email=$1`, [
        email,
    ]);
    if (users.rows.length === 0) {
        return null;
    }
    const user = users.rows[0];
    const match = await bcryptjs_1.default.compare(password, user.password);
    if (!match) {
        return false;
    }
    const token = jsonwebtoken_1.default.sign({ name: user.name, email: user.email, role: user.role, id: user.id }, config_1.default.jwtSecret, {
        expiresIn: "7d",
    });
    return { token, user };
};
exports.authService = {
    registration,
    login,
};
