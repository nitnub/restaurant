import * as jose from 'jose';

interface ReadTokenResult {
  admin?: boolean;
  authProvider?: string;
  avatar?: string;
  email?: string;
  exp?: number;
  firstName?: string;
  lastName?: string;
  iat?: number;
  id?: string;
  newUser?: boolean;
}

export default async function verifyToken(token: string, secret: string) {
  const encodedSecret = new TextEncoder().encode(secret);

  const { payload, protectedHeader } = await jose
    .jwtVerify(token, encodedSecret)
    .catch((error) => {
      console.log('[1] Token Error. Invalid Access Token.', error);
    });
  return payload;
}

export function readToken(token: string): ReadTokenResult {
  return jose.decodeJwt(token);
}
