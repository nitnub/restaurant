import { gql } from '@apollo/client';

// export const ADD_APP_USER = gql`
export default gql`
  mutation AddNewAppUser($email: String!, $globalUserId: String!) {
    addAppUserResult(email: $email, globalUserId: $globalUserId) {
      __typename
      ... on AddedAppUser {
        id
        globalUserId
        email
        stripeCustomerID
        avatar
        admin
      }
      ... on AddAppUserError {
        message
      }
      ... on NotAuthorized {
        message
      }
    }
  }
`;