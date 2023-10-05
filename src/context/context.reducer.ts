import { AppContext, Action } from '@/src/context/context.types';
import { ActionPayload } from '@/src/context/context.types';
import { defaultCart, defaultUser } from './context';
import client from '@/src/db/configs/apollo.client';

export default (state: AppContext, action: ActionPayload) => {
  const ctxCopy: AppContext = structuredClone(state);

  switch (action.type) {
    case Action.UPDATE_CART:
      ctxCopy.cart = action.payload;
      return ctxCopy;

    case Action.UPDATE_CART_ITEMS:
      ctxCopy.cart.items = action.payload;
      return ctxCopy;

    case Action.CLEAR_CART:
      ctxCopy.cart = defaultCart;
      return ctxCopy;

    case Action.UPDATE_USER:
      const updatedUser = { ...ctxCopy.user, ...action.payload };
      ctxCopy.user = updatedUser;
      return ctxCopy;

    case Action.UPDATE_UI_FOR_USER:
      const { avatar, cart } = action.payload;
      ctxCopy.user.avatar = avatar;
      if (cart.items.length > 0) {
        ctxCopy.cart = cart;
      }
      return ctxCopy;

    case Action.UPDATE_PROPERTIES:
      const updatedProps = action.payload;
      return { ...ctxCopy, ...updatedProps };

    case Action.SET_CHECKOUT_CART:
      const cartCopy = { ...ctxCopy.cart };
      ctxCopy.checkoutCart = cartCopy;
      return ctxCopy;

    case Action.SIGN_OUT:
      ctxCopy.cart = defaultCart;
      ctxCopy.user = defaultUser;
      ctxCopy.accessToken = action.payload.accessToken;
      client.clearStore();
      return ctxCopy;

    case Action.SIGN_IN_OAUTH:
      ctxCopy.authProvider = action.payload.authProvider;
      ctxCopy.accessToken = action.payload.accessToken;
      return ctxCopy;

    default:
      return state;
  }
};
