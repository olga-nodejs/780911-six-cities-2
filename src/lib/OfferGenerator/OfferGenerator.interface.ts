import { Offer } from '../../types/offer.js';

export interface OfferGenerator {
  generate(): Offer;
}
