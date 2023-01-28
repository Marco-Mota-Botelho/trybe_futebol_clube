import * as jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'jwt_secret';
const config: jwt.SignOptions = {
  algorithm: 'HS256',
  expiresIn: '24h',
};

export default function createToken(email: string) {
  const token = jwt.sign({ data: email }, secret, config);

  return token;
}

// oi
