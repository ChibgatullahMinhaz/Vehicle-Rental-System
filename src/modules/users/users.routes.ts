import { Router } from 'express';
import { userController } from './users.controller';
const router =Router();

router.get('/', userController.getAll)

const userRouter = router;
export default userRouter;