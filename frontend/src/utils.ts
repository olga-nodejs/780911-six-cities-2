import { MAX_PERCENT_STARS_WIDTH, STARS_COUNT, UserType } from './const';
import { APIUserType, CreateUserDto, APIOfferResponse } from './dto/types';
import { UserRegister, Offer, NewOffer } from './types/types';

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
    new Date(date)
  );

export const getStarsWidth = (rating: number) =>
  `${(MAX_PERCENT_STARS_WIDTH * Math.round(rating)) / STARS_COUNT}%`;

export const getRandomElement = <T>(array: readonly T[]): T =>
  array[Math.floor(Math.random() * array.length)];
export const pluralize = (str: string, count: number) =>
  count === 1 ? str : `${str}s`;
export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export class Token {
  private static _name = 'six-cities-auth-token';

  static get() {
    const token = localStorage.getItem(this._name);

    return token ?? '';
  }

  static save(token: string) {
    localStorage.setItem(this._name, token);
  }

  static drop() {
    localStorage.removeItem(this._name);
  }
}

export const adaptRegisterUserToApi = (user: UserRegister): CreateUserDto => ({
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  password: user.password,
  userType: user.type === UserType.Pro ? APIUserType.Pro : APIUserType.Starter,
  favorites: [],
});

export const adaptOfferToClient = (
  offer: APIOfferResponse,
  userFavorites?: string[]
): Offer => {
  return {
    id: offer._id,
    price: offer.rentalCost,
    rating: offer.rating,
    title: offer.title,
    isPremium: offer.premiumFlag,
    isFavorite: !!userFavorites?.includes(offer._id),
    city: {
      name: offer.city,
      location: {
        latitude: offer.coordinates[0],
        longitude: offer.coordinates[1],
      },
    },
    location: {
      latitude: offer.coordinates[0],
      longitude: offer.coordinates[1],
    },
    previewImage: offer.previewImage,
    type: offer.propertyType,
    bedrooms: offer.roomsNumber,
    description: offer.description,
    goods: offer.features,
    host: {
      name: offer.user.name,
      avatarUrl: offer.user.avatar,
      type: offer.user.userType === 'pro' ? UserType.Pro : UserType.Regular,
      email: offer.user.email,
    },
    images: offer.propertyPhotos,
    maxAdults: offer.guestsNumber,
  };
};

export const adaptOffersToClient = (
  offers: APIOfferResponse[],
  userFavorites?: string[]
): Offer[] => {
  return offers
    .filter((offer: APIOfferResponse) => offer.user !== null)
    .map((offer) => adaptOfferToClient(offer));
};

export const adaptOfferToAPI = (offer: NewOffer) => {
  return {
    title: offer.title,
    description: offer.description,
    city: offer.city.name,
    previewImage: offer.previewImage,
    propertyPhotos: offer.images,
    premiumFlag: offer.isPremium,
    propertyType: offer.type,
    roomsNumber: offer.bedrooms,
    guestsNumber: offer.maxAdults,
    rentalCost: offer.price,
    features: offer.goods,
    coordinates: [offer.location.latitude, offer.location.longitude],
  };
};
