import { City } from './city.js';
import { PropertyType } from './propertyType.js';
import { IntRange } from './intRange.js';
import { User } from './user.js';
import { PropertyFeature } from './propertyFeature.js';

export type Offer = {
  title: string;
  description: string;
  publication_date: Date;
  city: City;
  preview_image: string;
  property_photos: Array<string>;
  premium_flag: boolean;
  // favorite_flag: '';
  rating: number;
  property_type: PropertyType;
  number_of_rooms: IntRange<1, 8>;
  number_of_guests: IntRange<1, 10>;
  rental_cost: number;
  features: Array<PropertyFeature>;
  author: User;
  number_of_comments: number;
  coordinates: [number, number];
};
