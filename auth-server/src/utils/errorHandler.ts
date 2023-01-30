import { Request, Response, NextFunction } from 'express';

export default (f: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    f(req, res, next).catch(next); // pass through errors via next f(n)
  };
};
