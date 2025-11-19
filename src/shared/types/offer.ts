import { City } from './city.js';
import { PropertyType } from './propertyType.js';
import { User } from './user.js';
import { PropertyFeature } from './propertyFeature.js';

export type Offer = {
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
  author: User;
  coordinates: [number, number];
};
