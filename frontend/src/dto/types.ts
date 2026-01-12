export enum APICity {
  Paris = 'Paris',
  Cologne = 'Cologne',
  Brussels = 'Brussels',
  Amsterdam = 'Amsterdam',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf',
}

export enum APIPropertyType {
  apartment = 'apartment',
  House = 'house',
  Room = 'room',
  Hotel = 'hotel',
}

export enum APIPropertyFeature {
  Breakfast = 'Breakfast',
  AirConditioning = 'Air conditioning',
  LaptopFriendlyWorkspace = 'Laptop friendly workspace',
  BabySeat = 'Baby seat',
  Washer = 'Washer',
  Towels = 'Towels',
  Fridge = 'Fridge',
}

export type APIBaseOfferDTO = {
  title: string;
  description: string;
  publicationDate: Date;
  city: APICity;
  premiumFlag: boolean;
  rating: number;
  propertyType: APIPropertyType;
  roomsNumber: number;
  guestsNumber: number;
  rentalCost: number;
  features: APIPropertyFeature[];
  coordinates: [number, number];
  commentsCount: number;
};

export type APIOfferDto = APIBaseOfferDTO & {
  user: {
    _id: string;
    name: string;
    userType: APIUserType;
    avatar: string;
    email: string;
  };

  id: string;
};

export type APICreateOfferDto = APIBaseOfferDTO & {
  id: string;
  previewImage: File;
  propertyPhotos: File[];
  userId: string;
};

export type APIUpdateOfferDto = APIBaseOfferDTO & {
  previewImage: File;
  propertyPhotos: File[];
  userId: string;
};

export type APIOfferResponse = APIBaseOfferDTO & {
  _id: string;
  previewImage: string;
  propertyPhotos: string[];
  user: {
    _id: string;
    name: string;
    avatar: string;
    userType: APIUserType;
    email: string;
  };
};

export type CommentDto = {
  text: string;
  publicationDate: string;
  userId: string;
  offerId: string;
  rating: number;
};

export type ResponseCommentDTO = {
  id: string;
};

export enum APIUserType {
  Pro = 'pro',
  Starter = 'starter',
}

export type UserDto = {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  userType: APIUserType;
  favorites?: string[];
};

export type LoginUserDto = {
  email: string;
  password: string;
};

export type CreateUserDto = {
  name: string;
  email: string;
  avatar?: File;
  password: string;
  userType: APIUserType;
  favorites: string[];
};
