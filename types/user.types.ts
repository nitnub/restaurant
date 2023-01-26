// export interface User {
//   id?: string;
//   firstName: string;
//   lastName?: string;
//   email: string;
//   password?: string;
//   avatar?: string;
//   passHash?: string;
//   passResetToken?: string;
//   admin?: boolean;
// }
export interface Guest {
  id: string;
}

export interface LoggedInUser extends Guest {
  id: string;
  firstName: string;
  email: string;
  avatar: string;
  admin: boolean;
  iat: number;
  exp: number;
}