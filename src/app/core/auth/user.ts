import { Role } from "./role";

export interface User {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  roles: Role[];
}
