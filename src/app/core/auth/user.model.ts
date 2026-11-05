import { RoleEnum } from "./role.enum";

export interface IUser {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  roles: RoleEnum[];
}
