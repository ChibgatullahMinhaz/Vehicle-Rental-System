"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post("/signup", auth_controller_1.authControllers.createUser);
router.post('/signin', auth_controller_1.authControllers.userLogin);
const authRoutes = router;
exports.default = authRoutes;
