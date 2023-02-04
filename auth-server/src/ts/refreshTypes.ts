import { Types } from 'mongoose';
import { RefreshTokenPayload } from './tokenTypes';

export interface RefreshItem {
  globalUserID: Types.ObjectId | string;
  iat: number;
  exp: number;
  _doc?: RefreshTokenPayload;
}
