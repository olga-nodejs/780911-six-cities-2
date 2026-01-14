import { DEFAULT_USER_FILE } from '../../../modules/user/index.js';

export const DEFAULT_STATIC_IMAGES = [
  DEFAULT_USER_FILE,
  'default_preview_image.jpg',
  'default_property_image.png',
  'default_property_image_2.png',
];

export enum AVATAR {
  avatar = 'avatar',
}

export const STATIC_RESOURCE_FIELDS = [
  'avatar',
  'previewImage',
  'propertyPhotos',
];

export type StaticResourceField = (typeof STATIC_RESOURCE_FIELDS)[number];
