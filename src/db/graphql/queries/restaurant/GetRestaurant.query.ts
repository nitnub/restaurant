import { gql } from '@apollo/client';

// export const GET_RESTAURANT = gql`
export default gql`
  query GetRestaurant($id: Int!) {
    restaurantResult(id: $id) {
      __typename
      ... on Restaurant {
        id
        name
        description
        style
        rating
        image
        imageSm
        dish {
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
        }
      }
      ... on RestaurantError {
        message
      }
    }
  }
`;
