export default class AppError extends Error {
  code?: number;
  statusCode: number;
  status: string;
  isOperational: boolean;
  errors?: Error[];
  // errors?: string;
  keyValue?: object;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
  // const a = {this.message, this.statusCode}/
}
