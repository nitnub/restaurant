import { gql } from '@apollo/client';

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
