import { Request, Response } from 'express';
import User from '../models/userModel.js';
import Token from '../models/tokenModel.js';
import globalCatch from '../utils/errorHandler';
import AuthService from './auth.service.js';
import Logger from '../libs/logger.js';
import { OAuthRequest } from 'ts/utilTypes.js';
import AppError from '../utils/appError.js';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  testDeleteAll = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    let message = '';
    Token.deleteMany({ exp: { $gt: 0 } }, () => {
      message += `Removed all Refresh items, `;
      Logger.warn('deleted all Refresh items');
    });
    User.deleteMany({ admin: true });
    User.deleteMany({ admin: false }, () => {
      message += `Removed all Users`;
      Logger.warn('deleted all Users');
    });

    res.status(200).json({
      status: 'success',
      success: true,
      message,
    });
  };

  register = globalCatch(
    async (req: Request, res: Response): Promise<Response | void> => {
      // create new global user from req body
      const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
        admin: req.body.admin,
        active: req.body.active,
      };

      const registerResult = await this.authService.register(newUser, res);

      res.status(201).json({
        status: 'succcess',
        success: true,
        data: registerResult,
      });
    }
  );

  signin = globalCatch(
    async (req: Request, res: Response): Promise<Response | void> => {
      const { email, password } = req.body;

      const accessToken = await this.authService.signin(email, password, res);

      res.status(200).json({
        status: 'success',
        success: true,
        data: { accessToken },
      });
    }
  );

  signinOAuth = globalCatch(
    async (req: Request, res: Response): Promise<Response | void> => {
      const { idToken, provider }: OAuthRequest = req.body;
      if (provider === 'www.google.com') {
        const resp = await this.authService.verifyGoogleToken(idToken, res);
        res.status(200).json({
          status: 'success',
          success: true,
          data: { resp },
        });
      } else {
        throw new AppError(`Invalid OAuth provider ("${provider}")`, 400);
      }
    }
  );

  signout = globalCatch(
    async (req: Request, res: Response): Promise<Response | void> => {
      let result;
      let signOutAll = req.body.signOutAll;
      let refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        result = await this.authService.signout(signOutAll, refreshToken, res);
      } else {
        result = 'User was already logged out.';
      }

      res.status(200).json({
        status: 'success',
        success: true,
        result,
      });
    }
  );

  token = globalCatch(
    async (req: Request, res: Response): Promise<Response | void> => {
      const data = await this.authService.token(req, res);

      res.status(200).json({
        status: 'success',
        success: true,
        data,
      });
    }
  );
}

export default new AuthController();
