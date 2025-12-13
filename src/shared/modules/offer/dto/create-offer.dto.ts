import { City, PropertyType, PropertyFeature } from '../../../types/index.js';

export class CreateOfferDTO {
  public title!: string;
  public description!: string;
  public publicationDate!: Date;
  public city!: City;
  public previewImage!: string;
  public propertyPhotos!: Array<string>;
  public premiumFlag!: boolean;
  // favorite_flag!: '';
  public rating!: number;
  public propertyType!: PropertyType;
  public roomsNumber!: number;
  public guestsNumber!: number;
  public rentalCost!: number;
  public features!: Array<PropertyFeature>;
  public userId!: string;
  public coordinates!: [number, number];
  public commentsCount!: number;
}
// try to use objectId
// create own custom id and use it everywhere or create cust id helper to work with id from mongoose, mongoose has own helpers to solve this issue
