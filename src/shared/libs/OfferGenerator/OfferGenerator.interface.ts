import { Offer } from '../../types/index.js';

export interface OfferGenerator {
  generate(): Offer;
}
