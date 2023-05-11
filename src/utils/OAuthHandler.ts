import AuthorizationHandler from '@/utils/authorizationHandler';
import { Context } from '@apollo/client';
import { AuthProvider } from '@/types/utilTypes';
import { setCookie } from './cookieHandler';



export default class OAauthHandler extends AuthorizationHandler {
  private SUPPORTED_OAUTH_PROVIDERS = ['www.google.com'];
  private SIGN_IN_OAUTH_URL =
  process.env.NEXT_PUBLIC_AUTH_SERVER_SIGN_IN_OAUTH_URL;

  constructor(ctx: Context) {
    super(ctx);
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
      headers: {
        'Content-Type': 'application/json',
      },
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

      const { authProvider, avatar, exp } = JSON.parse(
        Buffer.from(accessToken.split('.')[1], 'base64').toString()
      );

      setCookie('accessToken', accessToken, exp);
      adImage && setCookie('avatar', adImage, exp);
      avatar && setCookie('avatar', avatar, exp);

      this.ctx.setAuthProvider(authProvider);
      this.ctx.setAccessToken(() => accessToken);

      this.setProfile(accessToken);

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
