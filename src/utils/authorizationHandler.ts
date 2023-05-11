import { Context } from '@apollo/client';
import { newGuestID } from './newGuestID';

import { AuthProvider } from '@/types/utilTypes';
import { clearCookie, getCookie, setCookie } from './cookieHandler';

const guestProfile = {
  admin: false,
  avatar: '',
  email: 'Sign In',
  exp: 0,
  firstName: '',
  iat: 0,
  id: 'Guest',
};

const emptyCart = { items: [], totalCost: 0, totalCount: 0 };

export default class AuthorizationHandler {
  // private SUPPORTED_OAUTH_PROVIDERS = ['www.google.com'];
  private SIGN_IN_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_SIGN_IN_URL;
  // private SIGN_IN_OAUTH_URL =
  // process.env.NEXT_PUBLIC_AUTH_SERVER_SIGN_IN_OAUTH_URL;
  private SIGN_OUT_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_SIGN_OUT_URL;
  private TOKEN_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_TOKEN_URL;
  private PROFILE_KEY = 'loggedInUser';
  private TOKEN_KEY = 'accessToken';
  protected ctx: Context;

  static token: string = '';
  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  public async signIn(email: string, password: string) {
    // create request
    const requestBody = {
      email,
      password,
    };
    let response;
    try {
      response = await fetch(this.SIGN_IN_URL, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      return console.log(
        'There was an issue logging into the application. Please try again later.'
      );
    }
    const data = await response.json();

    if (data.status === 'success') {
      const { accessToken } = data.data;
      const parsedUser = JSON.parse(
        Buffer.from(accessToken.split('.')[1], 'base64').toString()
      );

      this.ctx.setAuthProvider(parsedUser.authProvider);

      setCookie('accessToken', accessToken, parsedUser.exp);

      this.ctx.setAccessToken(() => accessToken);
      this.setProfile(accessToken); //

      return {
        status: data.status,
        success: true,
        accessToken: data.data.accessToken,
      };
    }

    const message =
      data.status === 'fail'
        ? data.message
        : 'Systm error. Please contact a system administrator.';

    return {
      status: 'fail',
      success: false,
      message,
    };
  }

  // public async signInOAuth(
  //   idToken: string,
  //   provider: AuthProvider,
  //   additionalData: { image: string }
  // ) {
  //   const adImage = additionalData.image;

  //   if (!this.SUPPORTED_OAUTH_PROVIDERS.includes(provider)) {
  //     return {
  //       status: 'fail',
  //       success: false,
  //       message: `Unsupported OAuth provider "${provider}"`,
  //     };
  //   }

  //   // create request
  //   const requestBody = {
  //     idToken,
  //     provider,
  //   };

  //   const response = await fetch(this.SIGN_IN_OAUTH_URL, {
  //     method: 'POST',
  //     body: JSON.stringify(requestBody),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     // credentials: 'include',
  //   });

  //   const data = await response.json();

  //   if (data instanceof Error) {
  //     return {
  //       status: 'fail',
  //       success: false,
  //       message: data.message,
  //     };
  //   }

  //   if (data.status === 'success') {
  //     const accessToken = data.data.resp.accessToken;

  //     const { authProvider, avatar, exp } = JSON.parse(
  //       Buffer.from(accessToken.split('.')[1], 'base64').toString()
  //     );

  //     setCookie('accessToken', accessToken, exp);
      
  //     adImage && setCookie('avatar', adImage, exp);
  //     avatar && setCookie('avatar', avatar, exp);

  //     this.ctx.setAuthProvider(authProvider);
  //     this.ctx.setAccessToken(() => accessToken);

  //     this.setProfile(accessToken);

  //     return {
  //       status: data.status,
  //       success: true,
  //       accessToken,
  //     };
  //   }

  //   const message =
  //     data.status === 'fail'
  //       ? data.message
  //       : 'Systm error. Please contact a system administrator.';

  //   return {
  //     status: 'fail',
  //     success: false,
  //     message,
  //   };
  // }

  public setProfile(accessToken: string) {
    const parsedUser = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString()
    );

    setCookie(this.PROFILE_KEY, parsedUser, parsedUser.exp);
    setCookie(this.TOKEN_KEY, accessToken, parsedUser.exp);

    this.ctx.setEmail(parsedUser.email);
  }

  public getProfile() {
    return getCookie(this.PROFILE_KEY) === ''
      ? false
      : getCookie(this.PROFILE_KEY);
  }

  public async signOut(signOutAll: boolean) {
    // Create request
    const guestID = newGuestID();
    const requestBody = {
      signOutAll,
    };

    // Send sign-out request
    await fetch(this.SIGN_OUT_URL, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    clearCookie(this.PROFILE_KEY);

    clearCookie('avatar');

    // Clear cart
    this.ctx.setCart(() => emptyCart);
    this.ctx.setTotalCount(0);
    this.ctx.setTotalCost(0);

    clearCookie('cart');

    // Remove access token from context
    setCookie('accessToken', guestID, -1, false);

    this.ctx.setEmail('Sign In');
    this.ctx.setProfile(guestProfile);
    this.ctx.setAccessToken(() => guestID);
  }

  public async updateAccessToken(ctx: Context) {
    const response = await fetch(this.TOKEN_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (data.status === 'fail') {
      return {
        status: data.status,
        success: false,
        message: data.message,
      };
    }
    if (data.status === 'success') {
      const { accessToken } = data.data;

      const parsedUser = JSON.parse(
        Buffer.from(accessToken.split('.')[1], 'base64').toString()
      );

      setCookie('accessToken', accessToken, parsedUser.exp);

      ctx.setAccessToken(() => accessToken);

      ctx.setEmail(() => parsedUser.email);
      this.setProfile(accessToken);

      return {
        status: data.status,
        success: true,
        accessToken: data.data.accessToken,
      };
    }
    return {
      status: 'fail',
      success: false,
      message: 'Unable to verify user. Please log in again...',
    };
  }
}
