import * as jose from 'jose';

export default async function verifyToke(token: string, secret: string) {
  const encodedSecret = new TextEncoder().encode(secret);

  const { payload, protectedHeader } = await jose.jwtVerify(
    token,
    encodedSecret
  ).catch((error) => {
    return error
    // return {
    //   nextTarget: 'authServer',
    //   message: error
    // }
  });
  
  return payload;
}
