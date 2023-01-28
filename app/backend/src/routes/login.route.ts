import { Router } from 'express';
import LoginController from '../controller/login.controller';
import validateLogin from '../middlewares/login.middlewares';

const router = Router();
const loginController = new LoginController();

router.post('/', validateLogin, loginController.login);

export default router;
