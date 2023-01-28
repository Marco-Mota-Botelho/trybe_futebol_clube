import { Request, Response } from 'express';
import LoginService from '../services/login.service';
// oi

export default class LoginController {
  constructor(private loginService: LoginService = new LoginService()) {}

  public login = async (
    req: Request,
    res: Response,
    // next: NextFunction,
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;

      const loggedUser = await this.loginService.login(email, password);

      if (loggedUser.token) {
        return res.status(loggedUser.status).json({ token: loggedUser.token });
      }

      return res.status(loggedUser.status).json({ message: loggedUser.message });
    } catch (error: unknown) {
      return res.status(500).json({ message: 'Internal Server error' });
    }
  };

  public fetchRole = async (
    req: Request,
    res: Response,
  ) => {
    const { authorization } = req.body;

    if (!authorization) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
}
