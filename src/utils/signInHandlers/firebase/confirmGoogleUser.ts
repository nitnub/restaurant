import { Context } from "@apollo/client";
import { Auth, AuthProvider, signInWithPopup } from "firebase/auth";
import OAauthHandler from "@/utils/OAuthHandler";
// import { AuthProvider } from "@/src/types/utilTypes";

export default async (ctx: Context, auth: Auth, provider: AuthProvider) => {
  const OAuth = new OAauthHandler(ctx);
  const GOOGLE_ID = 'www.google.com';

  // Query Google Firebase
  const googleResponse = await signInWithPopup(auth, provider);
  const user = googleResponse.user;
  const { photoURL } = user;
  const idToken = await user.getIdToken();

  const { success, message, accessToken } = await OAuth.signInOAuth(
    idToken,
    GOOGLE_ID,
    { image: photoURL }
  );

  return { success, message, accessToken, photoURL };
};

