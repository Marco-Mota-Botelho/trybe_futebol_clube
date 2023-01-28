import * as jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'jwt_secret';

export default function verifyToken(token: string) {
  const data = jwt.verify(token, secret);

  return data as jwt.JwtPayload;
}
