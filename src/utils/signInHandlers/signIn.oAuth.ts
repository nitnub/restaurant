import { useContext } from 'react';
import AppContext from '@/components/context';
import confirmGoogleUser from '@/utils/signInHandlers/firebase/confirmGoogleUser';
import consolidateGuestAndUserCarts from '@/utils/cart/consolidateGuestAndUserCarts';
import routeUserToHomepage from '@/utils/routing/routeUserToHomepage';
import { useRouter } from 'next/router';
import { updateCookieObject } from '@/utils/cookieHandler';

import { Cart } from '@/types/cartTypes';

import app from '@/utils/firebaseConfig';
import { formatAppUserArgs } from '@/utils/addNewAppUser';

import { getAuth, GoogleAuthProvider } from 'firebase/auth';

import { readToken } from '@/utils/token';

import { SignInError } from '@/src/pages/signin';
import { Context } from '@apollo/client';
// import { AppContext } from 'next/app';

const provider = new GoogleAuthProvider();

// const ctx = useContext(AppContext);

let cart: Cart | null = {
  items: [],
  totalCount: 0,
  totalCost: 0,
};

interface SignInWithGoogleProps {
  ctx: Context;
  addNewAppUser;
  addItem;
  updateError: (type: SignInError, message: string) => void;
}

export const googleSignInHandler = async (
  // ctx: Context,
  // // router,
  // addNewAppUser,
  // addItem,
  // updateError: (type: SignInError, message: string) => void
  {
    ctx,
    // router,
    addNewAppUser,
    addItem,
    updateError,
  }: SignInWithGoogleProps
) => {
  const googleAuth = getAuth(app);
  // const router = useRouter();
  try {
    const { success, message, accessToken, photoURL } = await confirmGoogleUser(
      ctx,
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

    // ctx.setAvatar(photoURL);

    // Add the App User
    const { email, id, newUser } = readToken(accessToken);
    await addNewAppUser(formatAppUserArgs(email, id, accessToken));
    cart = await consolidateGuestAndUserCarts(accessToken, addItem);

    if (!cart) return;

    // // If there are items in the cart response, populate the local cart
    // updateCookieObject('cart', cart);

    // if (cart.items.length > 0) {
    //   ctx.setCart(cart);
    // }

    // setErrorMessage(() => '');
    updateError(SignInError.GENERAL, '');
    // return routeUserToHomepage(router, email, newUser);

    return { email, newUser, cart, photoURL };
  } catch (error) {
    console.log(error);
  }
};
