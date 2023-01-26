import log from '@/libs/logger';
import Stripe from './Stripe.resolver';
import Cart from '../redis/cart.repository';
import getFormattedCart from '@/utils/getFormattedCart';
import { prisma } from '@/configs/prisma.client';
import { CartItem } from '@/types/cartTypes';
import { Restaurant } from '@prisma/client';


const resolvers = {
  Mutation: {
    createPaymentResult: async (parent, args, context, otehr) => {
      
      // Authenticate user
      if (!context.req.isAuthenticated) {
        log.error('User is not authenticated. Unable to get payment method.');
        return context.req.errorResponse;
      }

      const { amount, paymentMethodID } = args;
      const globalUserId = context.req.user.id;

      const { stripeCustomerId } = await prisma.userAccount.findFirst({
        where: { globalUserId: globalUserId },
      });

      return Stripe.createPayment(amount, stripeCustomerId, paymentMethodID);
    },
    addAppUserResult: async (source, args, context) => {
      if (!context.req.isAuthenticated) {
        log.error('User is not authenticated. Unable to get payment method.');
        return context.req.errorResponse;
      }

      // if user does not exist
      const userExists = await prisma.userAccount.findFirst({
        where: { email: args.email },
      });

      if (userExists) {
        log.info('User already exists');
        return {
          message: `User ${args.email} already exists`,
        };
      }

      const { email, id } = await Stripe.addStripeCustomer(args);

      const newUser = {
        globalUserId: args.globalUserId,
        email,
        stripeCustomerId: id,
      };

      const result = await prisma.userAccount.create({ data: newUser });
      return result;
    },

    incrementCartResult: async (parent, args, context) => {
      const { user } = context.req;
      const { items } = args;
      if (!user.id) {
        log.error(
          'User is neither authenticated nor recognized as a Guest. Unable to find a cached cart. Refreshing the page may reset the user status.'
        );
        return context.req.errorResponse;
      }

      for (let item of items) {
        await Cart.addItem(user, item);
      }

      const cart = await Cart.getCart(user);

      return getFormattedCart(cart);
    },
    decrementCartResult: async (parent, args, context) => {
      const { user } = context.req;
      const { id } = args;
      if (!user.id) {
        log.error(
          'User is neither authenticated nor recognized as a Guest. Unable to find a cached cart. Refreshing the page may reset the user status.'
        );
        return context.req.errorResponse;
      }

      const cartItems: CartItem[] = await Cart.removeItem(user, id);

      return getFormattedCart(cartItems);
    },
    clearCartResult: async (parent, args, context) => {
      if (!context.req.isAuthenticated) {
        log.error('User is not authenticated. Unable to get payment method.');
        return context.req.errorResponse;
      }
      const { id } = context.req.user;

      return await Cart.clearCart(id);
    },
  },
  Query: {
    restaurantsResult: async () => {
      const restaurants = await prisma.restaurant.findMany();

      return { restaurants: restaurants };
    },
    restaurantResult: async (parent, args) => {
      const restaurants = await prisma.restaurant.findFirst({
        where: { id: args.id },
      });
      return restaurants;
    },
    dishes: async () => {
      const allDishes = await prisma.dish.findMany();
      return allDishes;
    },

    dishesByRestaurant: async (parent, args) => {
      const dishes = await prisma.dish.findMany({
        where: { restaurant: args.id },
      });
      return dishes;
    },
    getCartResult: async (parent, args, context) => {
      const { user } = context.req;

      if (!user.id) {
        log.error('User is not authenticated. Unable to get cached cart.');
        return context.req.errorResponse;
      }

      const cart = await Cart.getCart(user);

      return getFormattedCart(cart);
    },

    verifiedTotalResult: async (parent, args, context) => {
      if (!context.req.isAuthenticated) {
        log.error('User is not authenticated. Unable to get client secret.');
        return context.req.errorResponse;
      }

      let verifiedTotal = 0;
      const dishIds = [];
      const counts = {};

      for (let dish of args.dishes) {
        const id = Number(dish.id);
        dishIds.push(id);
        counts[id] = dish.count;
      }

      const prices = await prisma.dish.findMany({
        select: { id: true, price: true },
        where: {
          id: {
            in: dishIds,
          },
        },
      });

      for (let price of prices) {
        verifiedTotal += counts[price.id] * Number(price.price);
      }

      return { verifiedTotal };
    },

    clientSecretResult: async (source, args, context) => {
      // Authenticate user
      if (!context.req.isAuthenticated) {
        log.error('User is not authenticated. Unable to get client secret.');
        return context.req.errorResponse;
      }

      const globalUserID = context.req.user.id;

      const { stripeCustomerId } =
        (await prisma.userAccount.findFirst({
          where: { globalUserId: globalUserID },
        })) || '';

      if (!stripeCustomerId) {
        log.error('Unable to find customerID in the DB!');
        throw new Error('Unable to find customerID in the DB!');
      }

      return await Stripe.clientSecret(stripeCustomerId);
    },

    paymentMethodsResult: async (source, args, context) => {
      if (!context.req.isAuthenticated) {
        log.error('User is not authenticated. Unable to get payment method.');
        return context.req.errorResponse;
      }
      const globalUserID = context.req.user.id;

      const { stripeCustomerId } =
        (await prisma.userAccount.findFirst({
          where: { globalUserId: globalUserID },
        })) || '';

      if (!stripeCustomerId) {
        log.error('Unable to find customerID in the DB!');
        throw new Error('Unable to find customerID in the DB!');
      }
      return await Stripe.getPaymentMethod(stripeCustomerId);
    },
    customerTransactionsResult: async (source, args, context) => {
    
      if (!context.req.isAuthenticated) {
        log.error('User is not authenticated. Unable to get payment method.');
        return context.req.errorResponse;
      }
      const globalUserID = context.req.user.id;

      const { stripeCustomerId } = await prisma.userAccount.findFirst({
        where: { globalUserId: globalUserID },
      });

      if (!stripeCustomerId) {
        log.error('Unable to find customerID in the DB!');
        throw new Error('Unable to find customerID in the DB!');
      }

      return await Stripe.getCustomerTransactionsFormatted(stripeCustomerId);

    },
  },

  Restaurant: {
    dish: async (restaurant: Restaurant) => {
      return await prisma.dish.findMany({
        where: { restaurant: Number(restaurant.id) },
      });
    },
  },

  RestaurantResult: {
    __resolveType(obj: RestaurantResult) {
      if (Object.keys(obj).includes('message')) {
        return 'RestaurantError';
      }
      return 'Restaurant';
    },
  },

  RestaurantsResult: {
    __resolveType(obj: RestaurantsResult) {
      if (Object.keys(obj).includes('message')) {
        return 'RestaurantsError';
      }
      return 'Restaurants';
    },
  },
  CreatePaymentResult: {
    __resolveType(obj: CreatePaymentResult) {
      if (Object.keys(obj).includes('nextTarget')) {
        return 'NotAuthorized';
      }
      if (Object.keys(obj).includes('type')) {
        return 'StripeError';
      }
      return 'CreatePayment';
    },
  },
  ClientSecretResult: {
    __resolveType(obj: ClientSecretResult) {
      if (Object.keys(obj).includes('nextTarget')) {
        return 'NotAuthorized';
      }
      if (Object.keys(obj).includes('type')) {
        return 'StripeError';
      }
      return 'ClientSecret';
    },
  },
  CustomerTransactionsResult: {
    __resolveType(obj: CustomerTransactionsResult) {
      if (Object.keys(obj).includes('nextTarget')) {
        return 'NotAuthorized';
      }
      if (Object.keys(obj).includes('type')) {
        return 'StripeError';
      }
      if (Object.keys(obj).includes('message')) {
        return 'CustomerTransactionsError';
      }
      return 'CustomerTransactions';
    },
  },
  PaymentMethodsResult: {
    __resolveType(obj: PaymentMethodsResult) {
      if (Object.keys(obj).includes('nextTarget')) {
        return 'NotAuthorized';
      }
      if (Object.keys(obj).includes('type')) {
        return 'StripeError';
      }
      return 'PaymentMethods';
    },
  },
  VerifiedTotalResult: {
    __resolveType(obj: ResolverError | VerifiedTotal, contextValue) {
      if (Object.keys(obj).includes('nextTarget')) {
        return 'NotAuthorized';
      }
      if (Object.keys(obj).includes('verifiedTotal')) {
        return 'VerifiedTotal';
      }
      return 'VerifiedTotalError';
    },
  },
  CartResult: {
    __resolveType(obj: CartResult) {
      if (Object.keys(obj).includes('nextTarget')) {
        return 'NotAuthorized';
      }
      if (Object.keys(obj).includes('items')) {
        return 'Cart';
      }
      return 'CartError';
    },
  },
  ClearCartResult: {
    __resolveType(obj: ClearCartResult) {
      if (Object.keys(obj).includes('nextTarget')) {
        return 'NotAuthorized';
      }
      if (Object.keys(obj).includes('message')) {
        return 'ClearCartError';
      }
      return 'ClearCart';
    },
  },
  AddAppUserResult: {
    __resolveType(obj: AddAppUserResult) {
      if (Object.keys(obj).includes('nextTarget')) {
        return 'NotAuthorized';
      }
      if (Object.keys(obj).includes('globalUserId')) {
        return 'AddedAppUser';
      }
      return 'AddAppUserError';
    },
  },
};

export default resolvers;

export interface NotAuthorizedError {
  id?: number;
  status?: string;
  message?: string;
  nextTarget: string;
}

export interface StripeError {
  type?: string;
  message?: string;
  docUrl?: string;
  statusCode?: number;
  requestId?: string;
}

type ResolverError = NotAuthorizedError | StripeError;

export interface VerifiedTotal {
  verifiedTotal: number;
}

