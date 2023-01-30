import { Jwt, JwtPayload } from "jsonwebtoken";

// To be extended as needed
export type AuthProvider = 'www.google.com';

export interface OAuthRequest {
  idToken: string;
  provider: AuthProvider;
}

// Option 1
interface FirebaseError extends Error {
  message: string;
  name: string;
  status: string;
  statusCode: number;
}
export interface FirebaseErrorResponse extends Error {
  error: FirebaseError
  message: string;
  stack: string;
  status: string;
  success: boolean;
}

// // Option 2 -> Nested...
// export interface FirebaseErrorResponse extends Error {
//   error: {
//     message: string;
//     name: string;
//     status: string;
//     statusCode: number;
//   };
//   message: string;
//   stack: string;
//   status: string;
//   success: boolean;
// }
