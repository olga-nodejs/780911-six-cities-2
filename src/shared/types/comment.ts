import { MockUser } from './user.js';

type BaseComment = {
  text: string;
  publicationDate: Date;
  rating: number;
  offerId: string; // Should it be ref to Offer id?
};

export type MockComment = BaseComment & {
  user: MockUser;
};

export type Comment = BaseComment & {
  userId: string;
};
