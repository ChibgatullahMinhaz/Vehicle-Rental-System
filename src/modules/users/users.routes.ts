import { Router } from "express";
import { userController } from "./users.controller";
import { auth } from "../../middleware/auth";
const router = Router();

router.get("/", auth("admin"), userController.getAll);
router.delete("/:userId", auth("admin"), userController.deleteUser);
router.put("/:userId", auth("admin", "customer"), userController.updateUser);
const userRouter = router;
export default userRouter;
