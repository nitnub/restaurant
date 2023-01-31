import * as jose from 'jose';

export default async function verifyToken(token: string, secret: string) {
  const encodedSecret = new TextEncoder().encode(secret);

  const { payload, protectedHeader } = await jose.jwtVerify(
    token,
    encodedSecret
  ).catch((error) => {
  });
  console.log('jose payload:', payload)
  return payload;
}
