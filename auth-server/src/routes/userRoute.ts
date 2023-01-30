import { Router } from 'express';
import authController from '../controllers/auth.controller';

const userRouter = Router();

userRouter.post('/register', authController.register);
userRouter.post('/signin', authController.signin);
userRouter.post('/signin-oauth', authController.signinOAuth);
userRouter.post('/signout', authController.signout);
userRouter.get('/token', authController.token);
// userRouter.delete('/test-cleanup', authController.testDeleteAll);

export default userRouter;


