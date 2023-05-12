import { gql } from '@apollo/client';

// export const GET_CART = gql`
export default gql`
  query GetCart {
    getCartResult {
      __typename
      ... on Cart {
        items {
          id
          name
          itemType
          description
          image
          restaurant
          vegetarian
          vegan
          glutenFree
          count
        }
        totalCost
        totalCount
      }
      ... on CartError {
        message
      }
      ... on NotAuthorized {
        message
      }
    }
  }
`;
