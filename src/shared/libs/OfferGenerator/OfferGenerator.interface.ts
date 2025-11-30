import { MockOffer } from '../../types/index.js';

export interface OfferGenerator {
  generate(): MockOffer;
}
