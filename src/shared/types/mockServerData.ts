import { City } from './city.enum.js';
import { PropertyFeature } from './propertyFeature.enum.js';
import { PropertyType } from './propertyType.enum.js';
import { User } from './user.js';

export type MockServerData = {
  descriptions: Array<string>;
  titles: Array<string>;
  cities: Array<City>;
  preview_images: Array<string>;
  property_photos: Array<Array<string>>;
  property_types: Array<PropertyType>;
  features: Array<PropertyFeature>;
  authors: Array<User>;
  coordinates: { [C in City]: [number, number][] };
};
