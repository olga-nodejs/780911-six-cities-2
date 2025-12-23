import { City, PropertyFeature, PropertyType } from '../../../types/index.js';

export const OfferValidationMessage = {
  title: {
    length:
      'The title must contain a minimum of 10 and a maximum of 100 characters',
    invalidFormat: 'Title must be string type',
  },
  description: {
    length:
      'The description must contain a minimum of 20 and a maximum of 1024 characters',

    invalidFormat: 'Description must be string type',
  },
  publicationDate: {
    invalidFormat: 'PostDate must be a valid ISO date',
  },
  city: {
    invalid: `City type must one of next values ${Object.values(City).join(
      ', '
    )}`,
  },
  previewImage: {
    invalid: 'Preview image is required',
  },
  propertyPhotos: {
    invalidlength: 'Should contain 6 images',
    type: 'Should be a path to an image',
  },
  premiumFlag: {
    type: 'Premium flag value must be boolean',
  },
  rating: {
    invalidFormat: 'Rating must be an integer',
    minValue: 'Minimum rating is 1',
    maxValue: 'Maximum rating is 5',
  },

  propertyType: {
    invalid: `Property type must one of next values ${Object.values(
      PropertyType
    ).join(', ')}`,
  },
  roomsNumber: {
    invalidFormat: 'Rooms number must be an integer',
    minValue: 'Minimum rooms number is 1',
    maxValue: 'Maximum rooms number is 8',
  },
  guestsNumber: {
    invalidFormat: 'Guests number must be an integer',
    minValue: 'Minimum guests number is 1',
    maxValue: 'Maximum guests number is 10',
  },
  rentalCost: {
    invalidFormat: 'Price must be an number',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100 000',
  },

  features: {
    invalidFormat: 'Field features must be an array',
    invalidValue: `Categories field must be an array containing next values: ${Object.values(
      PropertyFeature
    ).join(', ')}`,
    minValue: 'There should be at least 1 item in an array',
    maxValue: `Max features number is ${Object.values(PropertyFeature).length}`,
  },
  userId: {
    invalidId: 'UserId field must be a valid id',
  },
  coordinates: {
    invalidFormat: 'Coordinates field  must be an array',
    invalidLength:
      'Coordinates array should have 2 items [latitude, longitude]',
    invalidArrayItemFormat: 'Should be an number',
  },
  commentsCount: {
    invalidFormat: 'Comments count number must be an integer',
  },
} as const;
