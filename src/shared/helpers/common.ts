import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as crypto from 'node:crypto';
import chalk from 'chalk';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';

import { Logger } from '../libs/logger/index.js';

import {
  MockOffer,
  PropertyType,
  PropertyFeature,
  MockUser,
  UserType,
  CityKey,
  MockCityData,
} from '../types/index.js';

import { ApplicationError, ValidationErrorField } from '../libs/rest/index.js';

export function generateErrorMessage(error: unknown, message: string) {
  console.error(chalk.red(message));

  if (error instanceof Error) {
    console.error(chalk.red(error.message));
  }
}

export function generateRandomValue(
  min: number,
  max: number,
  numAfterDigit = 0
) {
  return +(Math.random() * (max - min) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[]): T[] {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition =
    startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]): T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getDaysAgo(daysAgo: number): Date {
  const today = new Date();

  const nDaysAgo = new Date(today);
  nDaysAgo.setUTCDate(today.getUTCDate() - Math.floor(daysAgo));

  return nDaysAgo;
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function generateRandomEmail(
  adjectives: Array<string>,
  nouns: Array<string>,
  domains: Array<string>
) {
  return `${getRandomItem(adjectives)}.${getRandomItem(nouns)}@${getRandomItem(
    domains
  )}`;
}
export function createMockUser(values: string[]): MockUser {
  const [name, email, password, userType, avatar] = values;

  return {
    name,
    email,
    password,
    userType: userType as UserType,
    avatar,
    favorites: [],
  };
}

const createDBMockCity = (values: string[]): MockCityData => {
  const [name, latitude, longitude] = values;

  return {
    name: name as CityKey,
    location: {
      latitude: Number(latitude),
      longitude: Number(longitude),
    },
  };
};

export function createMockOffer(line: string): MockOffer {
  const values = line.trimEnd().split('\t');
  const [
    title,
    description,
    publicationDate,
    city,
    previewImage,
    propertyPhotos,
    premiumFlag,
    rating,
    propertyType,
    roomsNumber,
    guestsNumber,
    rentalCost,
    features,
    user,
    coordinates,
    commentsCount,
  ] = values;

  const offer = {
    title,
    description,
    publicationDate: new Date(publicationDate),
    city: createDBMockCity(city.split(',')),
    previewImage,
    propertyPhotos: propertyPhotos.split(','),
    premiumFlag: premiumFlag === 'true',
    rating: Number(rating),
    propertyType: propertyType as PropertyType,
    roomsNumber: Number(roomsNumber),
    guestsNumber: Number(guestsNumber),
    rentalCost: Number(rentalCost),
    features: features.split(',') as PropertyFeature[],
    user: createMockUser(user.split(',')) as MockUser,
    coordinates: coordinates.split(',').map(Number) as [number, number],
    commentsCount: Number(commentsCount),
  };

  return offer;
}

export function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

export function isObject(value: unknown): value is Record<string, object> {
  return typeof value === 'object' && value !== null;
}

export function valueToTSVString(value: unknown) {
  if (Array.isArray(value)) {
    return value.join();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (isPlainObject(value)) {
    return Object.values(value).join();
  }

  if (isNumber(value) || typeof value === 'boolean') {
    return value.toString();
  }

  return value as string;
}

export function getCurrentDirectory(path: URL | string) {
  return dirname(fileURLToPath(path));
}

export function getMongoURI(
  login: string,
  password: string,
  host: string,
  port: string,
  dbName: string
) {
  return `mongodb://${login}:${password}@${host}:${port}/${dbName}?authSource=admin`;
}
// mongodb://admin:mypassword@example.com:27017/?authSource=admin

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export function requireArgs(logger: Logger, args: Record<string, unknown>) {
  const missing = Object.entries(args)
    .filter(
      ([_, value]) => value === undefined || value === null || value === ''
    )
    .map(([key]) => key);

  if (missing.length > 0) {
    logger.error(
      `Missing required arguments: ${missing.join(', ')}`,
      new Error(`Missing required arguments: ${missing.join(', ')}`)
    );

    throw new Error(`Missing required argument ${missing.join()}`);
  }
}

export function fillDTO<T, V>(someDTO: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDTO, plainObject, {
    excludeExtraneousValues: true,
  });
}

export function createErrorObject(
  errorType: ApplicationError,
  error: string,
  details: ValidationErrorField[] = []
) {
  return {
    errorType,
    error,
    details,
  };
}

export function reduceValidationErrors(
  errors: ValidationError[]
): ValidationErrorField[] {
  return errors.map(({ property, value, constraints }) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : [],
  }));
}

export function getFullServerPath(host: string, port: number) {
  return `http://${host}:${port}`;
}
