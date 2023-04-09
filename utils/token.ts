import * as jose from 'jose';

export default async function verifyToken(token: string, secret: string) {
  const encodedSecret = new TextEncoder().encode(secret);

  const { payload, protectedHeader } = await jose.jwtVerify(
    token,
    encodedSecret
  ).catch((error) => {
    console.log('[1] Token Error. Invalid Access Token.', error)
  });
  // console.log('jose payload:', payload)
  return payload;
}

export function readToken(token: string) {
  return jose.decodeJwt(token)
}
