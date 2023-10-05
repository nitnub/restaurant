import AuthorizationHandler from '@/utils/authorizationHandler';
import { Context } from '@apollo/client';
import { AuthProvider } from '@/types/utilTypes';
import { setCookie } from './cookieHandler';
import { Action } from '@/src/context/context.types';

export default class OAauthHandler extends AuthorizationHandler {
  private SUPPORTED_OAUTH_PROVIDERS = ['www.google.com'];
  private SIGN_IN_OAUTH_URL =
    process.env.NEXT_PUBLIC_AUTH_SERVER_SIGN_IN_OAUTH_URL;

  constructor(context: Context) {
    super(context);
  }

  public async signInOAuth(
    idToken: string,
    provider: AuthProvider,
    additionalData: { image: string }
  ) {
    const adImage = additionalData.image;

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
      headers: this.DEFAULT_REQUEST_HEADERS,
      // credentials: 'include',
    });

    const data = await response.json();

    if (data instanceof Error) {
      return {
        status: 'fail',
        success: false,
        message: data.message,
      };
    }

    if (data.status === 'success') {
      const accessToken = data.data.resp.accessToken;

      const { authProvider, avatar, exp } =
        this.parseUserFromToken(accessToken);

      setCookie('accessToken', accessToken, exp);
      adImage && setCookie('avatar', adImage, exp);
      avatar && setCookie('avatar', avatar, exp);

      this.setProfile(accessToken);

      const payload = { authProvider, accessToken };
      this.dispatch({ type: Action.SIGN_IN_OAUTH, payload });

      return {
        status: data.status,
        success: true,
        accessToken,
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
}
