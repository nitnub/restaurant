import { gql } from '@apollo/client';

// export const GET_PAYMENT_METHODS = gql`
export default gql`
  query GetStripePaymentMethods {
    paymentMethodsResult {
      __typename
      ... on PaymentMethods {
        paymentMethods {
          id
          billingDetails {
            address {
              city
              country
              line1
              line2
              postalCode
              state
            }
            email
            name
            phone
          }
          card {
            brand
            checks {
              addressLine1Check
              addressPostalCodeCheck
              cvcCheck
            }
            country
            expMonth
            expYear
            fingerprint
            funding
            generatedFrom
            last4
            networks {
              available
              preferred
            }
            threeDSecureUsage {
              supported
            }
            wallet
          }
          customer
          type
        }
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
