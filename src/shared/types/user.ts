import { UserType } from './index.js';

export type User = {
  name: string;
  email: string;
  avatar: string;
  userType: UserType;
  favorites: Array<string>;
};

export type MockUser = User & {
  password: string;
};
