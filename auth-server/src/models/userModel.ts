// import mongoose from 'mongoose';
import { model, Schema } from 'mongoose';
import GlobalUser from '../ts/userTypes';
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from 'bcrypt';

export const userSchema = new Schema<GlobalUser>(
  {
    firstName: {
      type: String,
      required: [true, 'User must have a first name'],
    },
    lastName: {
      type: String,
      required: [true, 'User must have a last name'],
    },
    email: {
      type: String,
      required: [true, 'User must have an email'],
      unique: true,
      validate: [isEmail, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'User password must be at least 8 characters'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    avatar: {
      type: String,
    },
    admin: {
      type: Boolean,
      required: [true, 'User must have a user type designation'],
      default: false,
    },
    active: {
      type: Boolean,
      required: [true, 'User must have an active state designation'],
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre<GlobalUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  // hash and salt the password
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function (
  password: string
): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};

const User = model<GlobalUser>('User', userSchema);

export default User;
