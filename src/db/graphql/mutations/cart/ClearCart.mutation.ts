import { gql } from '@apollo/client';

// export const CLEAR_CART = gql`
export default gql`
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
