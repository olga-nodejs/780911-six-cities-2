import { City } from './city.enum.js';
import { PropertyType } from './propertyType.enum.js';
import { PropertyFeature } from './propertyFeature.enum.js';
import { MockUser } from './user.js';

type BaseOffer = {
  title: string;
  description: string;
  publicationDate: Date;
  city: City;
  previewImage: string;
  propertyPhotos: Array<string>;
  premiumFlag: boolean;
  // favorite_flag: '';
  rating: number;
  propertyType: PropertyType;
  roomsNumber: number;
  guestsNumber: number;
  rentalCost: number;
  features: Array<PropertyFeature>;
  coordinates: [number, number];
  commentsCount: number;
};

export type MockOffer = BaseOffer & {
  user: MockUser;
};
export type Offer = BaseOffer & {
  userId: string;
};

export const OfferFileFields: {
  previewImage: keyof BaseOffer;
  propertyPhotos: keyof BaseOffer;
} = {
  previewImage: 'previewImage',
  propertyPhotos: 'propertyPhotos',
} as const;

export type OfferFiles = {
  previewImage?: Express.Multer.File[];
  propertyPhotos?: Express.Multer.File[];
};

export const ALLOWED_UPDATE_FIELDS = [
  'title',
  'description',
  'publicationDate',
  'city',
  'previewImage',
  'propertyPhotos',
  'premiumFlag',
  'propertyType',
  'roomsNumber',
  'guestsNumber',
  'rentalCost',
  'features',
  'coordinates',
] as const;
