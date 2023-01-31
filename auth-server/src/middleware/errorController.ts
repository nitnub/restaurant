import Logger from '../libs/logger';
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import mongoose, { Error, MongooseError } from 'mongoose';
import AppError from '../utils/appError';

interface DuplicateObj {
  email: string;
}

interface MongoDupError extends AppError {
  keyValue: DuplicateObj;
}

const handleDuplicateFieldsMDB = (err: MongoDupError) => {
  const fieldName = Object.keys(err.keyValue)[0];
  const message = `Duplicate ${fieldName} value of "${
    err.keyValue[fieldName as keyof DuplicateObj]
  }". Please try again with a different value.`;

  return new AppError(message, 400);
};

const handleValidationErrorMDB = (err: AppError) => {
  const errors = Object.values(err.errors!).map(
    (element: Error) => element.message
  );

  const message = `Invalid input. ${errors.join('. ')}.`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token.', 401);
};

const handleSyntaxError = () => {
  return new AppError(`Malformed Request. Please try again.`, 400);
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to customer
  if (err.isOperational) {
    res.status(err.statusCode!).json({
      status: err.status,
      success: false,
      message: err.message,
    });
    // Programming or other unknown error: don't want to leak details to public
  } else {
    Logger.error('[Production Error]');
    Logger.error(err);

    res.status(500).json({
      status: 'Error',
      success: false,
      message: 'Unknown error',
    });
  }
};

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode!).json({
    status: err.status,
    success: false,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

export default (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.code === 11000)
      err = handleDuplicateFieldsMDB(err as MongoDupError);
    if (err.name === 'ValidationError') err = handleValidationErrorMDB(err);
    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    if (err.name === 'SyntaxError') err = handleSyntaxError();
    sendErrorProd(err, res);
  }
};
