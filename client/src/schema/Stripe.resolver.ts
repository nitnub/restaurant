// import fetch from 'node-fetch';
import { mutatePropertyNames, snakeToCamel } from '@/libs/formatter';
import { capitalizeAllWords } from '@/libs/formatter';

import Logger from '../../libs/logger';

const stripeConnect = require('stripe')(process.env.STRIPE_SK_TEST);
const Stripe = {
  addStripeCustomer: async (args) => {
    const response = await fetch(process.env.STRIPE_ADD_CUSTOMER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${process.env.STRIPE_SK_TEST?.toString() || ''}`,
      },
      body: new URLSearchParams({
        email: args.email,
      }),
    }).then(function (response) {
      return response.json();
    });

    return response;
  },
  clientSecret: async (stripeCustomerId: string) => {
    const stripe = require('stripe')(process.env.STRIPE_SK_TEST);

    const intent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
    });

    return { clientSecret: intent.client_secret };
  },
  clientSecretFromCustomerID: async (args) => {
    const stripe = require('stripe')(process.env.STRIPE_SK_TEST);

    const intent = await stripe.setupIntents.create({
      customer: args.customerID,
      payment_method_types: ['card'],
    });

    return { clientSecret: intent.client_secret };
  },
  getPaymentMethod: async (stripeCustomerId: string) => {
    const response = await stripeConnect.paymentMethods.list(
      {
        customer: stripeCustomerId,
        type: 'card',
      },
      {
        apiKey: process.env.STRIPE_SK_TEST,
      }
    );

    const methods = [];
    for (let element of response.data) {
      let billingCopy = { ...element.billing_details };
      let cardCopy = { ...element.card };
      const checksCopy = { ...element.card.checks };
      const threeDCopy = { ...element.card.three_d_secure_usage };
      const addressCopy = { ...element.billing_details.address };
      const pmCopy = { ...element };

      // Format Checks field names
      mutatePropertyNames(checksCopy, snakeToCamel);

      // Format Card field names
      mutatePropertyNames(cardCopy, snakeToCamel);

      // Assemble Card object
      cardCopy = {
        ...cardCopy,
        checks: checksCopy,
        threeDSecureUsage: threeDCopy,
      };

      // Format Address field names

      mutatePropertyNames(addressCopy, snakeToCamel);
      // Assemble Billing object
      billingCopy = {
        ...billingCopy,
        address: addressCopy,
      };

      // Format Payment Method field names
      mutatePropertyNames(pmCopy, snakeToCamel);

      // Assemble Payment Method Object
      methods.push({ ...pmCopy, card: cardCopy, billingDetails: billingCopy });
    }

    return { paymentMethods: methods };
  },
  createPayment: async (
    amount: number,
    stripeCustomerId: string,
    paymentMethodID: string
  ) => {
    try {
      const paymentIntent = await stripeConnect.paymentIntents.create(
        {
          amount,
          currency: 'usd',
          customer: stripeCustomerId,
          payment_method: paymentMethodID,
          off_session: true,
          confirm: true,
        },
        {
          apiKey: process.env.STRIPE_SK_TEST,
        }
      );

      const piCopy = { ...paymentIntent };
      const tipCopy = { ...paymentIntent.amount_details.tip };
      const cardCopy = { ...paymentIntent.payment_method_options.card };

      // format Card field names
      mutatePropertyNames(cardCopy, snakeToCamel);

      // // format Payment Intent field names
      mutatePropertyNames(piCopy, snakeToCamel);

      piCopy.amountDetails.tip = tipCopy;
      piCopy.paymentMethodOptions.card = cardCopy;

      return piCopy;
    } catch (err) {
      let errObject = {};

      if (err?.type) {
        errObject = {
          type: err.type,
          message: err.raw.message,
          docUrl: err.raw.doc_url,
          statusCode: err.raw.statusCode,
          requestID: err.raw.requestId,
        };
      }

      Logger.error(err.type);
      Logger.error(err.message);

      return errObject;
    }
  },
  getCustomerTransactions: async (id: string) => {
    const response = await stripeConnect.paymentIntents.list({
      limit: 25,
      customer: id, // I missed this param!
    });

    const { object, data, has_more: hasMore, url } = response;

    const dataFormatted = [];
    for (let entry of data) {
      const entryCopy = { ...entry };

      mutatePropertyNames(entryCopy, snakeToCamel);

      dataFormatted.push(entryCopy);
    }

    return { object, dataFormatted, hasMore, url };
  },
  getCustomerTransactionsFormatted: async (id: string) => {
    const transactionList = await Stripe.getCustomerTransactions(id);

    const pm = await Stripe.getPaymentMethod(id);
    const dataComplete = [];
    const paymentMethods = {};

    pm.paymentMethods.forEach((el) => {
      const id = el.id;
      const cardType = el.card.brand;
      const cardId = el.card.last4;
      const expMonth = el.card.expMonth;
      const expYear = el.card.expYear;
      const custId = el.customer;

      // Add a more user-friendly card name
      const cardName = capitalizeAllWords(cardType);

      paymentMethods[id] = {
        cardId,
        cardName,
        cardType,
        expMonth,
        expYear,
        custId,
      };
    });

    for (let ti of transactionList.dataFormatted) {
      const tiCopy = { ...ti };
      const paymentMethodId = tiCopy.paymentMethod;

      dataComplete.push({ ...tiCopy, ...paymentMethods[paymentMethodId] });
    }

    return { ...transactionList, dataFormatted: dataComplete };
  },
};

export default Stripe;

function mutatePropertyName(
  obj: { [name: string]: string },
  oldName: string,
  newName: string
) {
  obj[newName] = obj[oldName];
  delete obj[oldName];
}

function mutatePropertyNameFunc(
  oldName: string,
  obj: { [name: string]: string },
  fn: Function
) {
  obj[fn(oldName)] = obj[oldName];
  delete obj[oldName];
}
