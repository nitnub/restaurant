import { Dispatch, createContext } from 'react';
import { Cart, CartItem } from '../types/cartTypes';



const AppContext = createContext<ContextReducer>(null);




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

interface AppContext {
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
  ADD_TEST,
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
  | TestAction;

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

interface TestAction {
  type: Action.ADD_TEST;
  payload: string;
}

export default AppContext;
