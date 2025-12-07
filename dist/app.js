"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const db_1 = __importDefault(require("./config/db"));
const notFound_1 = __importDefault(require("./middleware/notFound"));
const autoReturn_job_1 = require("./corn/autoReturn.job");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
(0, db_1.default)();
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
(0, autoReturn_job_1.startAutoReturnJob)();
app.use(notFound_1.default);
exports.default = app;
