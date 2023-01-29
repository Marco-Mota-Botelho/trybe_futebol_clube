import { NextFunction, Response, Request } from 'express';
import verifyToken from './verifyToken';

export default async function validateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.header('authorization');

  if (!token) return res.status(401).json({ message: 'Token not found' });

  try {
    const userData = verifyToken(token);

    if (!userData) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
}
