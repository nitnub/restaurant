import { Context } from '@apollo/client';
import { newGuestID } from './newGuestID';
import {
  clearCookies,
  getCookie,
  resetUserCookies,
  setCookie,
} from './cookieHandler';
import { Dispatch } from 'react';
import { Action, ActionPayload } from '@/src/context/context.types';

export default class AuthorizationHandler {
  private SIGN_IN_URL: string = process.env.NEXT_PUBLIC_AUTH_SERVER_SIGN_IN_URL;
  private SIGN_OUT_URL: string =
    process.env.NEXT_PUBLIC_AUTH_SERVER_SIGN_OUT_URL;
  private TOKEN_URL: string = process.env.NEXT_PUBLIC_AUTH_SERVER_TOKEN_URL;
  private PROFILE_KEY: string = 'loggedInUser';
  private TOKEN_KEY: string = 'accessToken';

  protected DEFAULT_REQUEST_HEADERS = { 'Content-Type': 'application/json' };
  protected ctx: Context;
  protected dispatch: Dispatch<ActionPayload>;
  static token: string = '';

  constructor(context: Context) {
    this.ctx = context.ctx;
    this.dispatch = context.dispatch;
  }

  public async signIn(email: string, password: string) {
    const requestBody = {
      email,
      password,
    };
    let response: Response;
    try {
      response = await fetch(this.SIGN_IN_URL, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: this.DEFAULT_REQUEST_HEADERS,
      });
    } catch (err) {
      return console.log(
        'There was an issue logging into the application. Please try again later.'
      );
    }
    const data = await response.json();

    if (data.status === 'success') {
      const { accessToken } = data.data;
      const parsedUser = this.parseUserFromToken(accessToken);

      setCookie('accessToken', accessToken, parsedUser.exp);

      this.dispatch({
        type: Action.UPDATE_PROPERTIES,
        payload: { authProvider: parsedUser.authProvider, accessToken },
      });

      this.setProfile(accessToken);

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

  public setProfile(accessToken: string) {
    const parsedUser = this.parseUserFromToken(accessToken);

    setCookie(this.PROFILE_KEY, parsedUser, parsedUser.exp);
    setCookie(this.TOKEN_KEY, accessToken, parsedUser.exp);

    this.dispatch({
      type: Action.UPDATE_USER,
      payload: { email: parsedUser.email },
    });
  }

  public getProfile() {
    return getCookie(this.PROFILE_KEY) === ''
      ? false
      : getCookie(this.PROFILE_KEY);
  }

  public async signOut(signOutAll: boolean) {
    // Create request
    const guestID = newGuestID();

    // Send sign-out request
    await fetch(this.SIGN_OUT_URL, {
      method: 'POST',
      body: JSON.stringify({ signOutAll }),
      headers: this.DEFAULT_REQUEST_HEADERS,
    });

    // location.replace("/");
    resetUserCookies(this.PROFILE_KEY, guestID);
    this.dispatch({ type: Action.SIGN_OUT, payload: { accessToken: guestID } });
  }

  public async updateAccessToken(ctx: Context) {
    const response = await fetch(this.TOKEN_URL, {
      method: 'GET',
      headers: this.DEFAULT_REQUEST_HEADERS,
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
      const parsedUser = this.parseUserFromToken(accessToken);

      setCookie('accessToken', accessToken, parsedUser.exp);

      const user = { ...ctx.user, email: parsedUser.email };

      this.dispatch({
        type: Action.UPDATE_PROPERTIES,
        payload: { accessToken, user },
      });

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

  protected parseUserFromToken(accessToken: string) {
    return JSON.parse(
      Buffer.from(accessToken.split('.')[1], 'base64').toString()
    );
  }
}
