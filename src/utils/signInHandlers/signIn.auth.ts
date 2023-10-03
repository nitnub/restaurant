import consolidateGuestAndUserCarts from '@/utils/cart/consolidateGuestAndUserCarts';
import { Dispatch } from 'react';
import { updateCookieObject } from '@/utils/cookieHandler';

import { Cart } from '@/types/cartTypes';

import { SignInError } from '@/src/pages/signin';
import AuthorizationHandler from '@/utils/authorizationHandler';
import { Context, MutationFunction } from '@apollo/client';
import { Action, ActionPayload } from '@/components/context';

let cart: Cart | null = {
  items: [],
  totalCount: 0,
  totalCost: 0,
};

interface SignInAuthServerProps {
  ctx: Context;
  dispatch: Dispatch<ActionPayload>;
  email: string;
  password: string;
  addItem: MutationFunction;
  updateError: (type: SignInError, message: string) => void;
}

interface SignInResponse {
  email: string;
  newUser: boolean;
  cart: Cart;
  photoURL: string;
}

export const signInAuthServerHandler: (
  props: SignInAuthServerProps
) => Promise<SignInResponse> = async ({
  ctx,
  dispatch,
  email,
  password,
  addItem,
  updateError,
}: SignInAuthServerProps) => {
  try {
    const Auth = new AuthorizationHandler({ ctx, dispatch });

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
      // ctx.setCart(cart);
      dispatch({ type: Action.UPDATE_CART, payload: cart });
    }


    updateError(SignInError.GENERAL, '');

    return { email, newUser: false, cart, photoURL: 'NO_AVATAR' };
  } catch (err) {
    console.log(
      'There was an error logging into the application. Please try again later.'
    );
  }
};
