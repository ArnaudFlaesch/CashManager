export interface IUser {
  id: number;
  login: string;
  password: string;
  email: string;
  accessToken: string;
  name: string;
  firstname: string;
}

export interface IJWTResponse {
  id: number;
  email: string;
  accessToken: string;
  roles: string[];
  tokenType: string;
}
