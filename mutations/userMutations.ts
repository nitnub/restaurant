import { gql } from '@apollo/client';

// Only for testing T
// TODO: Remove when no longer needed
export const ADD_USER = gql`
  mutation AddNewAppUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $passHash: String
    $avatar: String
  ) {
    addAppUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      passHash: $passHash
      avatar: $avatar
    ) {
      firstName
      lastName
      email
      passHash
      avatar
    }
  }
`;

// export const REGISTER_NEW_USER = gql`
//   mutation RegisterUser(
//     $firstName: String!
//     $lastName: String!
//     $email: String!
//     $password: String!
//     $avatar: String
//   ) {
//     register(
//       firstName: $firstName
//       lastName: $lastName
//       email: $email
//       avatar: $avatar
//       password: $password
//     ) {
//       success
//       message
//       accessToken
//       refreshToken
//     }
//   }
// `;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      name
    }
  }
`;

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      success
      message
      accessToken
      refreshToken
    }
  }
`;

