import { gql } from '@apollo/client';

export const GET_OFFICIAL_TOTAL = gql`
  query GetVerifiedCartPrice($dishes: [DishInput!]) {
    verifiedTotalResult(dishes: $dishes) {
      __typename
      ... on VerifiedTotal {
        verifiedTotal
      }
      ... on VerifiedTotalError {
        message
      }
      ... on NotAuthorized {
        message
      }
    }
  }
`;
