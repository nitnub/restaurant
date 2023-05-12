import { gql } from '@apollo/client';

// export const GET_CLIENT_SECRET = gql`
export default gql`
  query GetStripeClientSecret {
    clientSecretResult {
      __typename
      ... on ClientSecret {
        clientSecret
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
