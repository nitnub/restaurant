
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