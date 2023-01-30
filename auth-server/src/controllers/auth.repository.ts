import GlobalUser from '../ts/userTypes';
import User from '../models/userModel';
import Token from '../models/tokenModel';
import AppError from '../utils/appError';
import { RefreshItem } from 'ts/refreshTypes';
import { Types } from 'mongoose';


class AuthRepository {
  constructor() {
    // connect to db
  }
/**
 * User collection
 */

  addUser = async (user: GlobalUser) => {
    // run preliminary validation of fields
    const testUser = new User(user);
    await testUser.validate();

    return await User.create(user);
  };

  writeRefresh = async (refreshDetails: RefreshItem): Promise<RefreshItem> => {
    // run preliminary validation of fields
    if (!refreshDetails || refreshDetails === undefined) {
      throw new AppError('Refresh details not provided', 400)
    }
    const testToken = new Token(refreshDetails);
    await testToken.validate();

    return await Token.create(refreshDetails);
  };

  findUserByEmail = async (email: string): Promise<GlobalUser | void> => {
    return await User.findOne({ email });
  };

  findUserByID = async (id: Types.ObjectId) => {
    return await User.findById(id)
  }

/**
 * Refresh collection
 */

  removeOneRefresh = async (refreshID: Types.ObjectId) => {
    return await Token.findByIdAndDelete(refreshID);
  };

  removeAllUserRefreshes = async (userID: Types.ObjectId) => {
    return await Token.deleteMany({ globalUserID: userID });
  };
}


export default AuthRepository;
