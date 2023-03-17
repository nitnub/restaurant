import { NextFunction, Response } from 'express';
import Logger from '@/libs/logger';
import type { NextRequest } from 'next/server';
import verifyToken from '../utils/token';

export interface RequestErrorResponse {
  status: string;
  message: string;
  nextTarget: string;
}
export interface VerifiedRequest extends NextRequest {
  user: LoggedInUser | Guest | string;
  isAuthorized: boolean;
  isAuthenticated: boolean;
  errorResponse: RequestErrorResponse;
}

export interface Guest {
  id: string;
}

export interface LoggedInUser extends Guest {
  id: string;
  firstName: string;
  email: string;
  avatar: string;
  admin: boolean;
  iat: number;
  exp: number;
}

export async function addUser(req: VerifiedRequest) {
  let decodedToken: LoggedInUser;
  req.user = 'User not validated';
  req.isAuthenticated = false;

  const authHeader = req.headers.authorization;

  const errorResponse = {
    status: 'fail',
    message: 'Invalid user type. Must be logged in or Guest.',
    nextTarget: 'set-guest',
  };

  if (!authHeader) {
    req.errorResponse = errorResponse;
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token || token === '') {
    errorResponse.message =
      'Error reading authorization header. Must be logged in or Guest.';
    req.errorResponse = errorResponse;
    return;
  }

  if (token.startsWith('Guest')) {
    req.user = { id: token };
    return;
  }

  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw Error('Unable to verify access tokens at this time.');
  }

  try {
    decodedToken = await verifyToken(token, process.env.ACCESS_TOKEN_SECRET)!;
  } catch (err) {
    errorResponse.message = 'Invalid access token. Attempting to update...';
    errorResponse.nextTarget = 'auth-server';

    if (err.message === 'jwt expired')
      errorResponse.message = 'Access token has expired';
    if (err.message === 'invalid token')
      errorResponse.message = 'Access token is invalid';
    req.errorResponse = errorResponse;

    return;
  }

  if (!decodedToken) {
    errorResponse.message =
      'Unable to verify access token. Attempting to update...';
    errorResponse.nextTarget = 'auth-server';
    req.errorResponse = errorResponse;
    return;
  }

  req.isAuthenticated = true;
  req.user = decodedToken;

  return;
}

export function logRequests(
  req: VerifiedRequest,
  res: Response,
  next: NextFunction
) {
  Logger.info(
    `Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on('finish', () => {
    Logger.info(
      `Result   -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
    );
  });
  return;
}

// See "Matching Paths" below
export const config = {
  matcher: '/api/graphql',
};
