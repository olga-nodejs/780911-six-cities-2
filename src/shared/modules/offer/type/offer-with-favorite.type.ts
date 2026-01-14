import { OfferEntity } from '../index.js';

export type OfferWithFavorite = Omit<OfferEntity, never> & {
  isFavorite: boolean;
};
