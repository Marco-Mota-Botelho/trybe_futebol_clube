import * as bcrypt from 'bcryptjs';
import Users from '../database/models/Users';
import createToken from '../auth/createToken';
import LoginResponse from '../interfaces/login.interface';

const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_OK = 200;

export default class LoginService {
  public userModel;
  constructor() {
    this.userModel = Users;
  }

  public login = async (email:string, password: string): Promise<LoginResponse> => {
    const user = await this.userModel.findOne({ where: { email } });

    console.log(`password: ${password}`);

    const token = createToken(email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return {
        status: HTTP_STATUS_UNAUTHORIZED,
        message: 'Incorrect email or password',
      };
    }

    return {
      status: HTTP_STATUS_OK,
      message: 'Login succesfull',
      token,
    };
  };

  public getRole = async (email: string) => {
    const user = await this.userModel.findOne({ where: { email } });
    // Impossible to be null because we always authenticate the user before calling this method
    return { role: user!.role };
  };
}
