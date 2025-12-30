import { UserType } from './index.js';

export type User = {
  name: string;
  email: string;
  image: string;
  userType: UserType;
  favorites: Array<string>;
};

export type MockUser = User & {
  password: string;
};
