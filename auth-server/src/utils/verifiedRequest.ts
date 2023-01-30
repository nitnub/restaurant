import GlobalUser from 'ts/userTypes';

export interface VerifiedRequest {
  cookie: string;
  user: GlobalUser;
}
