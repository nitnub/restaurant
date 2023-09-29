import { Jwt } from 'jsonwebtoken';

export interface NamedObject {
  name: string;
}
// To be extended as needed
export type AuthProvider = 'www.google.com';

export interface OAuthRequest {
  idToken: Jwt;
  provider: AuthProvider;
}

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

export interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number,
  ) => void;
}