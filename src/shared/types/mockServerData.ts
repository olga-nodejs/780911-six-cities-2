import { CityData, CityKey } from './city.enum.js';
import { PropertyFeature } from './propertyFeature.enum.js';
import { PropertyType } from './propertyType.enum.js';
import { MockUser } from './user.js';

export type MockServerData = {
  descriptions: Array<string>;
  titles: Array<string>;
  cities: Array<CityData>;
  preview_images: Array<string>;
  property_photos: Array<Array<string>>;
  property_types: Array<PropertyType>;
  features: Array<PropertyFeature>;
  users: Array<MockUser>;
  userData: {
    names: Array<string>;
    adjectives: Array<string>;
    nouns: Array<string>;
    domains: Array<string>;
    userTypes: Array<string>;
    passwords: Array<string>;
  };
  coordinates: { [C in CityKey]: [number, number][] };
};
