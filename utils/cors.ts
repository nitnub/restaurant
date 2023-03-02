import { Request, Response } from 'express';

const allowCors = (fn: Function) => async (req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Credentials', 'false');
   res.setHeader('Access-Control-Allow-Origin', '*');
  // another common pattern
  // console.log('request from:');
  // console.log(req.headers.origin);
 res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  await fn(req, res);
};

export default allowCors;
