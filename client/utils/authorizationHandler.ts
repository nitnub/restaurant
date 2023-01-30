import fetch from 'node-fetch';
import { Context } from '@apollo/client';
import { newGuestID } from './newGuestID';

import { AuthProvider } from '@/types/utilTypes';

export default class AuthorizationHandler {
  private SUPPORTED_OAUTH_PROVIDERS = ['www.google.com'];
  private SIGN_IN_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_SIGN_IN_URL 
  private SIGN_IN_OAUTH_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_SIGN_IN_OAUTH_URL
  private REGISTER_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_REGISTER_URL 
  private SIGN_OUT_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_SIGN_OUT_URL 
  private TOKEN_URL = process.env.NEXT_PUBLIC_AUTH_SERVER_TOKEN_URL 
  private PROFILE_KEY = 'loggedInUser';
  private TOKEN_KEY = 'accessToken';
  private ctx: Context;


  static token: string = '';
  constructor(ctx?) {
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
        credentials: 'include',
      });


      
    } catch (err) {
      return console.log(
        'There was an issue logging into the application. Please try again later.'
      );
    }
    const data = await response.json();
    if (data.status === 'fail') {
      return {
        status: data.status,
        success: false,
        message: data.message,
      };
    }
    if (data.status === 'success') {
      const parsedUser = JSON.parse(
        Buffer.from(data.data.accessToken.split('.')[1], 'base64').toString()
      );

      const { accessToken } = data.data;
      document.cookie = `accessToken=${JSON.stringify(
        accessToken
      )}; expires=${new Date(parsedUser.exp * 1000).toUTCString()}`;

      this.ctx.setAccessToken(() => accessToken);
      this.setProfile(accessToken); //

      return {
        status: data.status,
        success: true,
        accessToken: data.data.accessToken,
      };
    }
    return {
      status: 'fail',
      success: false,
      message: 'Systm error. Please contact a system administrator.',
    };
    // receive response

    // handle response errors

    // receive access token

    // set access token to variable -> handled on page.

    // return accessToken;
  }
  public async signInOAuth(
    idToken: string,
    provider: AuthProvider,
    additionalData
  ) {
    if (!this.SUPPORTED_OAUTH_PROVIDERS.includes(provider)) {
      return {
        status: 'fail',
        success: false,
        message: `Unsupported OAuth provider "${provider}"`,
      };
    }

    // create request
    const requestBody = {
      idToken,
      provider,
    };

    const response = await fetch(this.SIGN_IN_OAUTH_URL, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    console.log('google response:')
    console.log(data)
    if (data instanceof Error) {
      return {
        status: 'fail',
        success: false,
        message: data.message,
        // stack: data.stack
      };
    }
    if (!data.success) {
      return {
        status: data.status,
        success: false,
        message: data.message,
      };
    }
    if (data.status === 'success') {
      const accessToken = data.data.resp;

      const parsedUser = JSON.parse(
        Buffer.from(accessToken.split('.')[1], 'base64').toString()
      );

      document.cookie = `accessToken=${JSON.stringify(
        accessToken
      )}; expires=${new Date(parsedUser.exp * 1000).toUTCString()}`;

      if (additionalData.image) {
        document.cookie = `avatar=${JSON.stringify(
          additionalData.image
        )}; expires=${new Date(parsedUser.exp * 1000).toUTCString()}`;
      }
      if (parsedUser.avatar) {
        document.cookie = `avatar=${JSON.stringify(
          parsedUser.avatar
        )}; expires=${new Date(parsedUser.exp * 1000).toUTCString()}`;
      }

      this.ctx.setAccessToken(() => accessToken);
      this.setProfile(accessToken); //

      return {
        status: data.status,
        success: true,
        accessToken,
      };
    }
    return {
      status: 'fail',
      success: false,
      message: 'Systm error. Please contact a system administrator.',
    };
  }

  public setProfile(accessToken: string) {
    const parsedUser = JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString()
    );

    document.cookie = `${this.PROFILE_KEY}=${JSON.stringify(
      parsedUser
    )}; expires=${new Date(parsedUser.exp * 1000).toUTCString()}`;
    document.cookie = `${this.TOKEN_KEY}=${JSON.stringify(
      accessToken
    )}; expires=${new Date(parsedUser.exp * 1000).toUTCString()}`;

    this.ctx.setEmail(parsedUser.email);
  }

  public getProfile() {
    // return the user's profile info
    // extract loggedInUser details on page load
    // update page components with extracted loggedInUser details

    try {
      const cookie = document.cookie;
      const cInitial = cookie.split(`${this.PROFILE_KEY}=`)[1];
      const cFinal = cInitial.split(';')[0];
      const profile = JSON.parse(cFinal);
      return profile;
    } catch {
      return false;
    }
  }

  public async signOut(signOutAll: boolean) {
    // create request
    const guestID = newGuestID();
    const requestBody = {
      signOutAll,
    };

    const response = await fetch(this.SIGN_OUT_URL, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    document.cookie = `${this.PROFILE_KEY}=null; expires=${new Date(
      0
    ).toUTCString()}`;
    document.cookie = `avatar=null; expires=${new Date(0).toUTCString()}`;

    // clear cart
    this.ctx.setCart(() => {
      return { items: [], totalCost: 0, totalCount: 0 };
    });
    this.ctx.setTotalCount(0);
    this.ctx.setTotalCost(0);
    document.cookie = `cart=null; expires=${new Date(0).toUTCString()}`;

    // remove access token from ctx
    this.ctx.setAccessToken(() => guestID);
    document.cookie = `accessToken=${guestID}`;
    // this.ctx.setAccessToken(() => null);
    this.ctx.setEmail('Sign In');
    this.ctx.setProfile({
      admin: false,
      avatar: '',
      email: 'Sign In',
      exp: 0,
      firstName: '',
      iat: 0,
      id: 'Guest',
    });
  }

  public async updateAccessToken(ctx: Context) {
    const response = await fetch(this.TOKEN_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
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

      document.cookie = `accessToken=${JSON.stringify(
        accessToken
      )}; expires=${new Date(parsedUser.exp * 1000).toUTCString()}`;
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
  // public register() {}
}
