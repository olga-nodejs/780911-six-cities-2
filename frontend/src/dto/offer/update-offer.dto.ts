import { City, PropertyType, PropertyFeature } from './types';
import { UserType } from '../user/user-type';
export interface UpdateOfferDto {
  title: string;
  description: string;
  publicationDate: Date;

  city: City;

  previewImage: string;
  propertyPhotos: string[];

  premiumFlag: boolean;

  propertyType: PropertyType;

  roomsNumber: number;
  guestsNumber: number;

  rentalCost: number;

  features: PropertyFeature[];

  userId: string;

  coordinates: [number, number];
}
