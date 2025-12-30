import { MockUser } from './user.js';

type BaseComment = {
  text: string;
  publicationDate: Date;
  rating: number;
  offerId: string;
};

export type MockComment = BaseComment & {
  user: MockUser;
};

export type Comment = BaseComment & {
  userId: string;
};
