import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as crypto from 'node:crypto';
import chalk from 'chalk';
import { ClassConstructor, plainToInstance } from 'class-transformer';

import { Logger } from '../libs/Logger/index.js';

import {
  City,
  MockOffer,
  PropertyType,
  PropertyFeature,
  MockUser,
  UserType,
} from '../types/index.js';

export const generateErrorMessage = (error: unknown, message: string) => {
  console.error(chalk.red(message));

  if (error instanceof Error) {
    console.error(chalk.red(error.message));
  }
};

export const generateRandomValue = (
  min: number,
  max: number,
  numAfterDigit = 0
) => +(Math.random() * (max - min) + min).toFixed(numAfterDigit);

export const getRandomItems = <T>(items: T[]): T[] => {
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition =
    startPosition + generateRandomValue(startPosition, items.length);
  return items.slice(startPosition, endPosition);
};

export const getRandomItem = <T>(items: T[]): T =>
  items[generateRandomValue(0, items.length - 1)];

export const getDaysAgo = (daysAgo: number): Date => {
  const today = new Date();

  const nDaysAgo = new Date(today);
  nDaysAgo.setUTCDate(today.getUTCDate() - Math.floor(daysAgo));

  return nDaysAgo;
};

export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const createMockUser = (arr: Array<string>): MockUser => {
  const keys = ['name', 'email', 'image', 'password', 'userType'] as const;

  return keys.reduce((acc, key, index) => {
    if (key === 'userType') {
      acc.userType = arr[index] as UserType;
    } else {
      acc[key] = arr[index];
    }
    return acc;
  }, {} as MockUser);
};

export const createMockOffer = (line: string): MockOffer => {
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
    city: city as City,
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
};

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

export const valueToTSVString = (value: unknown) => {
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
};

export const getCurrentDirectory = (path: URL | string) =>
  dirname(fileURLToPath(path));

export const getMongoURI = (
  login: string,
  password: string,
  host: string,
  port: string,
  dbName: string
) =>
  `mongodb://${login}:${password}@${host}:${port}/${dbName}?authSource=admin`;
// mongodb://admin:mypassword@example.com:27017/?authSource=admin

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const requireArgs = (logger: Logger, args: Record<string, unknown>) => {
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
};

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, {
    excludeExtraneousValues: true,
  });
}

export function createErrorObject(message: string) {
  return {
    error: message,
  };
}
