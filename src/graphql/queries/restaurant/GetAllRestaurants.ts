import { gql } from '@apollo/client';

export const GET_ALL_RESTAURANTS = gql`
  query GetAllRestaurants {
    restaurantsResult {
      __typename
      ... on Restaurants {
        restaurants {
          id
          name
          description
          style
          rating
          image
          homePage
        }
      }
      ... on RestaurantsError {
        message
      }
    }
  }
`;
