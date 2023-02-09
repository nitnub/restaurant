import { gql } from '@apollo/client';

export const INCREMENT_CART = gql`
  mutation AddItemsToCart($items: [DishInput]) {
    incrementCartResult(items: $items) {
      __typename
      ... on Cart {
        items {
          id
          name
          itemType
          description
          image
          price
          restaurant
          restaurantName
          vegetarian
          vegan
          glutenFree
          count
        }
        totalCount
        totalCost
      }
      ... on NotAuthorized {
        id
        status
        message
        nextTarget
      }
      ... on CartError {
        message
      }
    }
  }
`;

export const DECREMENT_CART = gql`
  mutation RemoveItemFromCart($id: String!) {
    decrementCartResult(id: $id) {
      __typename
      ... on Cart {
        items {
          id
          name
          itemType
          description
          image
          price
          restaurant
          restaurantName
          vegetarian
          vegan
          glutenFree
          count
        }
        totalCount
        totalCost
      }
      ... on NotAuthorized {
        id
        status
        message
        nextTarget
      }
      ... on CartError {
        message
      }
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCartResult {
      __typename
      ... on ClearCart {
        success
      }
      ... on ClearCartError {
        message
      }
      ... on NotAuthorized {
        message
      }
    }
  }
`;

export const ADD_APP_USER = gql`
  mutation AddNewAppUser($email: String!, $globalUserId: String!) {
    addAppUserResult(email: $email, globalUserId: $globalUserId) {
      __typename
      ... on AddedAppUser {
        id
        globalUserId
        email
        stripeCustomerID
        avatar
        admin
      }
      ... on AddAppUserError {
        message
      }
      ... on NotAuthorized {
        message
      }
    }
  }
`;

export const CREATE_STRIPE_PAYMENT = gql`
  mutation CreatePayment($paymentMethodID: String!, $amount: Int!) {
    createPaymentResult(paymentMethodID: $paymentMethodID, amount: $amount) {
      __typename
      ... on CreatePayment {
        id
        object
        amount
        application
        created
        currency
        customer
        description
        invoice
        livemode
        processing
        review
        shipping
        source
        status
        amountCapturable
        amountDetails {
          tip {
            amount
          }
        }
        amountReceived
        applicationFeeAmount
        automaticPaymentMethods
        canceledAt
        cancellationReason
        captureMethod
        clientSecret
        confirmationMethod
        lastPaymentError
        latestCharge
        nextAction
        onBehalfOf
        paymentMethod
        paymentMethodOptions {
          installments
        }
        paymentMethodTypes
        receiptEmail
        setupFutureUsage
        statementDescriptor
        statementDescriptorSuffix
        transferData
        transferGroup
      }
      ... on StripeError {
        type
        message
        docUrl
        statusCode
        requestId
      }
      ... on NotAuthorized {
        message
      }
    }
  }
`;
