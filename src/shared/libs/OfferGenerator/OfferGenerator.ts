import { OfferGenerator as OfferGeneratorInterface } from './OfferGenerator.interface.js';
import { MockOffer, UserType } from '../../types/index.js';
import {
  getDaysAgo,
  getRandomItem,
  generateRandomValue,
  getRandomItems,
  generateRandomEmail,
} from '../../helpers/common.js';
import { MockServerData } from '../../types/index.js';
import { DEFAULT_USER_FILE } from '../../modules/user/user.constant.js';

const enum WeekDay {
  First = 1,
  Last = 7,
}

const enum Rooms {
  Min = 1,
  Max = 8,
}

const enum Rating {
  Min = 1,
  Max = 5,
}

const enum Guests {
  Min = 1,
  Max = 10,
}

const enum RentalCost {
  Min = 100,
  Max = 100000,
}

const INITIAL_COMMENT_COUNT = 0;

/**
 * Class responsible for generating mock `Offer` objects
 * using the provided mock data.
 * @implements {OfferGeneratorInterface}
 */

export class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockServerData) {}

  generate(): MockOffer {
    const city = getRandomItem(this.mockData.cities);

    const user = {
      name: getRandomItem(this.mockData.userData.names),
      email: generateRandomEmail(
        this.mockData.userData.adjectives,
        this.mockData.userData.nouns,
        this.mockData.userData.domains
      ),
      password: getRandomItem(this.mockData.userData.passwords),
      userType: getRandomItem(this.mockData.userData.userTypes) as UserType,
      favorites: [],
      avatar: DEFAULT_USER_FILE,
    };

    console.log({ user });
    return {
      title: getRandomItem(this.mockData.titles),
      description: getRandomItem(this.mockData.descriptions),
      publicationDate: getDaysAgo(
        generateRandomValue(WeekDay.First, WeekDay.Last)
      ),
      city,
      previewImage: getRandomItem(this.mockData.preview_images),
      propertyPhotos: getRandomItem(this.mockData.property_photos),
      premiumFlag: getRandomItem([true, false]),
      rating: generateRandomValue(Rating.Min, Rating.Max),
      propertyType: getRandomItem(this.mockData.property_types),
      roomsNumber: generateRandomValue(Rooms.Min, Rooms.Max),
      guestsNumber: generateRandomValue(Guests.Min, Guests.Max),
      rentalCost: generateRandomValue(RentalCost.Min, RentalCost.Max),
      features: getRandomItems(this.mockData.features),
      user,
      coordinates: getRandomItem(this.mockData.coordinates[city]),
      commentsCount: INITIAL_COMMENT_COUNT,
    };
  }
}
