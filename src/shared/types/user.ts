import { UserType } from './index.js';

export type User = {
  name: string;
  email: string;
  image: string;
  userType: UserType;
};

export type MockUser = User & {
  password: string;
};
