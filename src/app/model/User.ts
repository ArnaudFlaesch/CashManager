import { RoleEnum } from "./RoleEnum";

export type IUser = {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  roles: RoleEnum[];
};
