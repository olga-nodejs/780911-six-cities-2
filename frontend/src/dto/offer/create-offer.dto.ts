import { City, PropertyType, PropertyFeature } from './types';
import { UserType } from '../user/user-type';
export default class CreateOfferDto {
  id!: string;

  title!: string;
  description!: string;
  publicationDate!: Date;

  city!: City;

  previewImage!: string;
  propertyPhotos!: string[];

  premiumFlag!: boolean;
  rating!: number;

  propertyType!: PropertyType;

  roomsNumber!: number;
  guestsNumber!: number;

  rentalCost!: number;

  features!: PropertyFeature[];

  userId!: string;

  coordinates!: [number, number];
}
