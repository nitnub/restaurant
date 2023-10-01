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
import AuthorizationHandler from '@/utils/authorizationHandler';
import { Context } from '@apollo/client';

// const ctx = useContext(AppContext);

// const router = useRouter();

let cart: Cart | null = {
  items: [],
  totalCount: 0,
  totalCost: 0,
};

interface SignInAuthServerProps {
  ctx: Context;
  email: string;
  password: string;
  addItem;
  updateError: (type: SignInError, message: string) => void;
}

export const signInAuthServerHandler = async ({
  ctx,
  email,
  password,
  addItem,
  updateError,
}: SignInAuthServerProps) => {
  try {
    const Auth = new AuthorizationHandler(ctx);
    const { success, message, accessToken } = (await Auth.signIn(
      email,
      password
    )) || { success: null, message: null, accessToken: null };

    if (!success) {
      updateError(SignInError.GENERAL, message);
      return;
    }

    cart = await consolidateGuestAndUserCarts(accessToken, addItem);

    if (!cart) return;

    // If there are items in the cart response, populate the local cart
    updateCookieObject('cart', cart);
    if (cart.items.length > 0) {
      ctx.setCart(cart);
    }

    updateError(SignInError.GENERAL, '');

    return { email, newUser: false, cart, photoURL: 'NO_AVATAR' };
  } catch (err) {
    console.log(
      'There was an error logging into the application. Please try again later.'
    );
  }
};
