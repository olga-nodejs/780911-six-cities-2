export enum City {
  Paris = 'Paris',
  Cologne = 'Cologne',
  Brussels = 'Brussels',
  Amsterdam = 'Amsterdam',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf',
}

export enum PropertyType {
  apartment = 'apartment',
  House = 'house',
  Room = 'room',
  Hotel = 'hotel',
}

export enum PropertyFeature {
  Breakfast = 'Breakfast',
  AirConditioning = 'Air conditioning',
  LaptopFriendlyWorkspace = 'Laptop friendly workspace',
  BabySeat = 'Baby seat',
  Washer = 'Washer',
  Towels = 'Towels',
  Fridge = 'Fridge',
}

export class BaseOfferDTO {
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
  coordinates!: [number, number];
  commentsCount!: number;
}
