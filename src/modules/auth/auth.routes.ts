import { Router } from "express";
import { authControllers } from "./auth.controller";
const router = Router();

router.post("/signup", authControllers.createUser);
router.post('/signin',authControllers.userLogin)
const authRoutes = router;
export default authRoutes;
