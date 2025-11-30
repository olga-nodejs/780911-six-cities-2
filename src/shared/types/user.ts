export type User = {
  name: string;
  email: string;
  image: string;
};

export type MockUser = User & {
  password: string;
};
