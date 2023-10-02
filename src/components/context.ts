import { Dispatch, SetStateAction, createContext } from 'react';
import { Cart, CartItem } from '../types/cartTypes';

// const context = {
//   cart: {
//     items: [],
//     totalCost: 0,
//     totalCount: 0,
//   },
//   // cartButtons: [],
//   clientSecret: '',
//   customerID: '',
//   email: 'Sign In',
//   authProvider: 'standard',
//   avatar: '',
//   accessToken: '',
//   loggedUser: {
//     GUID: '',
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     avatar: '',
//     admin: '',
//     active: '',
//   },
//   checkoutTotal: 0,
//   checkoutCart: {
//     items: [],
//     totalCost: 0,
//     totalCount: 0,
//   },
//   profile: '',
//   query: '',
// };

export interface LoggedInUser {
  GUID: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  admin: boolean;
  active: boolean;
}

interface AppContext {
  cart: Cart;
  // {
  //   items: [],
  //   totalCost: 0,
  //   totalCount: 0,
  // },
  // cartButtons: [],
  clientSecret: string;
  customerID: string;
  email: string;
  authProvider: string;
  avatar: string;
  accessToken: string;
  loggedUser: LoggedInUser;
  checkoutTotal: number;
  checkoutCart: Cart;
  // {
  //   items: [],
  //   totalCost: number,
  //   totalCount: number,
  // },
  profile: string;
  query: string;
}

export interface ContextReducer {
  context: AppContext;
  // setContext: Dispatch<SetStateAction<TAppContext>>;
  dispatch: Dispatch<Action>;
}
// const AppContext = createContext<{AppContext | null, Dispatch<SetStateAction<AppContext>>}>(null);
const AppContext = createContext<ContextReducer>(null);

// export const ACTION = {
//   // ADD_TODO: 'add-todo',
//   // COMPLETE_TODO: 'complete-todo',
//   // DELETE_TODO: 'delete-todo',
//   UPDATE_CART: 'UPDATE_CART'
// };
export enum ActionType {
  // ADD_TODO: 'add-todo',
  // COMPLETE_TODO: 'complete-todo',
  // DELETE_TODO: 'delete-todo',
  UPDATE_CART,
  UPDATE_CART_ITEMS,
  ADD_TEST,
}

// type Payload = Action['type'] === ActionType.UPDATE_CART
//   ? Cart
//   : Action['type'] extends ActionType.ADD_TEST
//   ? number
//   : boolean;

export type Action = UPDATE_CART | UPDATE_CART_ITEMS | TestAction;

interface UPDATE_CART {
  type: ActionType.UPDATE_CART;
  payload: Cart;
}

interface UPDATE_CART_ITEMS {
  type: ActionType.UPDATE_CART_ITEMS;
  payload: CartItem[];
}

interface TestAction {
  type: ActionType.ADD_TEST;
  payload: string;
}

// export interface Action2 {
//   // needs rename
//   type: ActionType;
//   payload: Action['type'] extends ActionType.UPDATE_CART
//     ? Cart
//     : // : Action['type'] extends ActionType.ADD_TEST
//       // ? number
//       boolean;
// }

export default AppContext;
