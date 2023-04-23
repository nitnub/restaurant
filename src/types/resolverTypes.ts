import { Cart } from './cartTypes';
import { Restaurant } from './restaurantTypes';

import {
  AppUser,
  ClearCart,
  ClientSecret,
  Payment,
  PaymentMethod,
  StripeError,
  TransactionHistory,
} from './stripe.types';

export interface NotAuthorizedError {
  id?: number;
  status?: string;
  message?: string;
  nextTarget: string;
}

export interface ResultError {
  message: string;
}



export type ResolverError = NotAuthorizedError | ResultError;

export interface VerifiedTotal {
  verifiedTotal: number;
}

export type VerifiedTotalResult = VerifiedTotal | ResolverError;

export type RestaurantResult = Restaurant | ResolverError;

export type RestaurantsResult = Restaurant[] | ResolverError;

export type CreatePaymentResult = Payment | ResolverError | StripeError;

export type ClientSecretResult = ClientSecret | ResolverError | StripeError;

export type CustomerTransactionsResult =
  | TransactionHistory
  | ResolverError
  | StripeError;

export type PaymentMethodsResult =
  | PaymentMethod[]
  | ResolverError
  | StripeError;

export type CartResult = Cart | ResolverError;

export type ClearCartResult = ClearCart | ResolverError;

export type AddAppUserResult = AppUser | ResolverError;
