import { gql } from '@apollo/client';

// export const GET_CUSTOMER_TRANSACTIONS = gql`
export default gql`
  query GetCustomerTransactions {
    customerTransactionsResult {
      __typename
      ... on CustomerTransactions {
        object
        dataFormatted {
          id
          amount
          created
          currency
          customer
          amountReceived
          clientSecret
          paymentMethod
          transferData
          transferGroup
          cardId
          cardName
          cardType
          expMonth
          expYear
          custId
        }
        hasMore
        url
      }
      ... on CustomerTransactionsError {
        message
      }
      ... on StripeError {
        message
      }
      ... on NotAuthorized {
        message
      }
    }
  }
`;
