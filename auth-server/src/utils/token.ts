import jwt from 'jsonwebtoken';
// import { AccessTokenPayload, RefreshTokenPayload } from 'ts/tokenTypes';
import fetch from 'node-fetch';
import GlobalUser from 'ts/userTypes';
import {
  AccessToken,
  GoogleToken,
  GoogleTokenSignature,
  RefreshToken,
} from 'ts/tokenTypes';
import { RefreshItem } from 'ts/refreshTypes';

export const generateAccessToken = (user: GlobalUser) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw Error('Error generating access token');
  }

  // generate access token payload
  // const accessTokenPayload: AccessTokenPayload = {
  const accessTokenPayload: AccessToken = {
    id: user._id!,
    firstName: user.firstName,
    email: user.email,
    avatar: user.avatar,
    admin: user.admin,
  };

  return jwt.sign(
    accessTokenPayload,
    process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
    {
      expiresIn: process.env.ACCESS_TOKEN_LIFESPAN,
    }
  );
};

export const generateRefreshToken = (
  // refreshTokenPayload: RefreshTokenPayload //
  refreshTokenPayload: RefreshItem
): string => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw Error('Error generating refresh token');
  }

  return jwt.sign(
    refreshTokenPayload,
    process.env.REFRESH_TOKEN_SECRET as jwt.Secret
  );
};

export const verifyToken = <T>(
  token: string
): Promise<jwt.VerifyErrors | T> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as jwt.Secret,
      (err, payload) => {
        if (err) return reject(err);
        resolve(payload as T);
      }
    );
  });
};

export const getGoogleTokenCert = async (token: string): Promise<string> => {
  const unverifiedToken = jwt.decode(token);
  const parsedSignature: GoogleTokenSignature = JSON.parse(
    Buffer.from(token.split('.')[0], 'base64').toString()
  );

  const kid = parsedSignature.kid;

  const certResponse = await fetch(process.env.GOOGLE_PUBLIC_KEY_API_URL!, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(function (certResponse) {
    return certResponse.json();
  });

  const googleTokenCert = certResponse[kid];
  console.log(googleTokenCert);

  return googleTokenCert;
};

export const verifyTokenGoogle = async (
  token: string
): Promise<jwt.VerifyErrors | GoogleToken> => {
  const unverifiedToken = jwt.decode(token);

  const cert = await getGoogleTokenCert(token);
  return new Promise((resolve, reject) => {
    jwt.verify(token, cert, { algorithm: 'RS256' }, (err, payload) => {
      console.log(err);
      if (err) return reject(err);
      resolve(payload as T);
    });
  });
};

export const getTokenTimestamps = () => {
  // get refresh issued at time
  const iat = Math.floor(Date.now() / 1000);

  // get refresh expiration time

  const exp =
    iat + Number(process.env.REFRESH_TOKEN_LIFESPAN_IN_DAYS) * 24 * 60 * 60;
    
  return { iat, exp };
};
