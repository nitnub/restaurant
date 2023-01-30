import { Request, Response, NextFunction } from 'express';
import AppError from '@/utils/appError';

export default async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const verifiedData = {
    inputs: null,
    user: null,
    cookie: null,
  };
  const isValid = false;
  const token = req.cookies.refreshToken || null;

  if (isValid) {
    throw new AppError('Invalid refresh token', 400);
  }

  next();
}
