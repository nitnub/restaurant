import Logger from '../libs/logger';
import { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  Logger.error(`Path not found ${req.url}`);

  return res.status(400).json({
    message: `Path not found ${req.url}`,
  });
};
// a
