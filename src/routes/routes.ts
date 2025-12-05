import { Router } from "express";
import userRouter from "../modules/users/users.routes";

const router = Router();
router.use(userRouter);

export default router;
