import { Request, Response } from 'express';
import verifyToken from '../auth/verifyToken';
import LoginService from '../services/login.service';

const HTTP_STATUS_OK = 200;

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

  public fetchUserData = async (
    req: Request,
    res: Response,
  ) => {
    const authorization = req.header('authorization');

    if (!authorization) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const userDataPayload = verifyToken(authorization);

      const userRole = await this.loginService.getRole(userDataPayload.data);

      return res.status(HTTP_STATUS_OK).json(userRole);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}
