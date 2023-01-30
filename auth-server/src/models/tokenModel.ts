import mongoose, { Types, ObjectId } from 'mongoose';
import { RefreshItem } from '../ts/refreshTypes';

const tokenSchema = new mongoose.Schema<RefreshItem>(
  {
    globalUserID: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Refresh token must have global id'],
    },
    iat: {
      type: Number,
      required: [true, 'Refresh token must have an issued at time'],
    },
    exp: {
      type: Number,
      required: [true, 'Refresh token must have an expiration'],
    },
  },
  { timestamps: true }
);

const Token = mongoose.model('Token', tokenSchema);

export default Token;
