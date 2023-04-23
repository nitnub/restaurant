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