import { Dispatch } from 'react';
import { Cart, CartItem } from '@/types/cartTypes';

interface PropertyUpdate {
  cart?: Cart;
  clientSecret?: string;
  customerID?: string;
  authProvider?: string;
  accessToken?: string;
  user?: User;
  checkoutTotal?: number;
  checkoutCart?: Cart;
  profile?: string;
  query?: string;
}

export interface User {
  GUID: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  admin: boolean;
  active: boolean;
}

interface SignOutUpdate {
  accessToken: string;
}

interface SignInOAuthUpdate {
  authProvider: string;
  accessToken: string;
}

interface UserUpdate {
  GUID?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  avatar?: string;
  admin?: boolean;
  active?: boolean;
}

interface UIUpdate {
  avatar: string;
  cart: Cart;
}

export interface AppContext {
  cart: Cart;
  clientSecret: string;
  customerID: string;
  authProvider: string;
  accessToken: string;
  user: User;
  checkoutTotal: number;
  checkoutCart: Cart;
  profile: string;
  query: string;
}

export interface ContextReducer {
  ctx: AppContext;
  dispatch: Dispatch<ActionPayload>;
}

export enum Action {
  UPDATE_CART,
  UPDATE_CART_ITEMS,
  UPDATE_USER,
  UPDATE_UI_FOR_USER,
  UPDATE_PROPERTIES,
  CLEAR_CART,
  SET_CHECKOUT_CART,
  SIGN_OUT,
  SIGN_IN_OAUTH,
}

export type ActionPayload =
  | UPDATE_CART
  | UPDATE_CART_ITEMS
  | UPDATE_USER
  | UPDATE_UI_FOR_USER
  | UPDATE_PROPERTIES
  | CLEAR_CART
  | SET_CHECKOUT_CART
  | SIGN_OUT
  | SIGN_IN_OAUTH;

interface UPDATE_CART {
  type: Action.UPDATE_CART;
  payload: Cart;
}

interface UPDATE_CART_ITEMS {
  type: Action.UPDATE_CART_ITEMS;
  payload: CartItem[];
}

interface UPDATE_USER {
  type: Action.UPDATE_USER;
  payload: UserUpdate;
}

interface UPDATE_UI_FOR_USER {
  type: Action.UPDATE_UI_FOR_USER;
  payload: UIUpdate;
}

interface UPDATE_PROPERTIES {
  type: Action.UPDATE_PROPERTIES;
  payload: PropertyUpdate;
}

interface CLEAR_CART {
  type: Action.CLEAR_CART;
}

interface SET_CHECKOUT_CART {
  type: Action.SET_CHECKOUT_CART;
}

interface SIGN_OUT {
  type: Action.SIGN_OUT;
  payload: SignOutUpdate;
}

interface SIGN_IN_OAUTH {
  type: Action.SIGN_IN_OAUTH;
  payload: SignInOAuthUpdate;
}
