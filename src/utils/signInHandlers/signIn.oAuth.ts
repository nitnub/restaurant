import confirmGoogleUser from '@/utils/signInHandlers/firebase/confirmGoogleUser';
import consolidateGuestAndUserCarts from '@/utils/cart/consolidateGuestAndUserCarts';
import { Cart } from '@/types/cartTypes';
import app from '@/utils/firebaseConfig';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { readToken } from '@/utils/token';
import { SignInError } from '@/src/pages/signin';
import { Context, MutationFunction } from '@apollo/client';
import { Dispatch } from 'react';
import { ActionPayload } from '@/src/context/context.types';

const provider = new GoogleAuthProvider();

let cart: Cart | null = {
  items: [],
  totalCount: 0,
  totalCost: 0,
};

export interface SignInWithGoogleProps {
  ctx: Context;
  dispatch: Dispatch<ActionPayload>;
  addNewAppUser: (email: string, id: string, accessToken: string) => void;
  // addNewAppUser: MutationFunction;
  addItem: MutationFunction;
  updateError: (type: SignInError, message: string) => void;
}

export const googleSignInHandler = async ({
  ctx,
  dispatch,
  addNewAppUser,
  addItem,
  updateError,
}: SignInWithGoogleProps) => {
  const googleAuth = getAuth(app);

  try {
    const { success, message, accessToken, photoURL } = await confirmGoogleUser(
      { ctx, dispatch },
      googleAuth,
      provider
    );

    if (message === 'invalid signature') {
      updateError(SignInError.O_AUTH, 'Unable to identify user.');
      return;
    }

    if (!success) {
      updateError(SignInError.GENERAL, message);
      return;
    }

    // Add the App User
    const { email, id, newUser } = readToken(accessToken);

    await addNewAppUser(email, id, accessToken);
    cart = await consolidateGuestAndUserCarts(accessToken, addItem);

    if (!cart) return;

    updateError(SignInError.GENERAL, '');

    return { email, newUser, cart, photoURL };
  } catch (error) {
    console.log(error);
  }
};
