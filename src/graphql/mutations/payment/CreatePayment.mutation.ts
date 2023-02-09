import { gql } from '@apollo/client';

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
