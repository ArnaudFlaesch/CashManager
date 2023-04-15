import { RoleEnum } from './RoleEnum';

export interface IUser {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  roles: RoleEnum[];
}
