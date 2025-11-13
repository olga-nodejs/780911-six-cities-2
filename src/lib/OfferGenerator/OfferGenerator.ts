import { OfferGenerator as OfferGeneratorInterface } from './OfferGenerator.interface.js';
import { Offer } from '../../types/offer.js';
import {
  getDaysAgo,
  getRandomItem,
  generateRandomValue,
  getRandomItems,
} from '../../helpers/common.js';
import { MockServerData } from '../../types/mockServerData.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const MIN_RENTAL_COST = 100;
const MAX_RENTAL_COST = 100000;

export class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockServerData) {}

  generate(): Offer {
    const city = getRandomItem(this.mockData.cities);
    return {
      title: getRandomItem(this.mockData.titles),
      description: getRandomItem(this.mockData.descriptions),
      publicationDate: getDaysAgo(
        generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY)
      ),
      city,
      previewImage: getRandomItem(this.mockData.preview_images),
      propertyPhotos: getRandomItem(this.mockData.property_photos),
      rating: generateRandomValue(MIN_RATING, MAX_RATING),
      propertyType: getRandomItem(this.mockData.property_types),
      roomsNumber: generateRandomValue(MIN_ROOMS, MAX_ROOMS),
      guestsNumber: generateRandomValue(MIN_GUESTS, MAX_GUESTS),
      rentalCost: generateRandomValue(MIN_RENTAL_COST, MAX_RENTAL_COST),
      features: getRandomItems(this.mockData.features),
      author: getRandomItem(this.mockData.authors),
      coordinates: getRandomItem(this.mockData.coordinates[city]),
      premiumFlag: getRandomItem([true, false]),
    };
  }
}
