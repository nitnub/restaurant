import GlobalUser from 'ts/userTypes';
import { VerifiedRequest } from '../verifiedRequest';

declare global {
  namespace Express {
    export interface Request {
      user: GlobalUser;
      verified: VerifiedRequest;
      cookies: string;
    }
  }
}
