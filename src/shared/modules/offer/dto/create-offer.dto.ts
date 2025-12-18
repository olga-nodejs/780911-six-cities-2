import {
  MaxLength,
  MinLength,
  IsDateString,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsNumber,
  IsMongoId,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { City, PropertyType, PropertyFeature } from '../../../types/index.js';
import { OfferValidationMessage } from './offer-validation.messages.js';

export class CreateOfferDTO {
  @IsString({ message: OfferValidationMessage.title.invalidFormat })
  @MinLength(10, { message: OfferValidationMessage.title.minLength })
  @MaxLength(100, { message: OfferValidationMessage.title.maxLength })
  public title!: string;

  @IsString({ message: OfferValidationMessage.description.invalidFormat })
  @MinLength(20, {
    message: OfferValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: OfferValidationMessage.description.maxLength,
  })
  public description!: string;

  @IsDateString(
    {},
    { message: OfferValidationMessage.publicationDate.invalidFormat }
  )
  public publicationDate!: Date;

  @IsEnum(City, {
    message: OfferValidationMessage.city.invalid,
  })
  public city!: City;

  // TODO: check after adding multer

  public previewImage!: string;
  // TODO: check after adding multer
  @IsArray()
  @ArrayMinSize(6, {
    message: OfferValidationMessage.propertyPhotos.invalidlength,
  })
  @ArrayMaxSize(6, {
    message: OfferValidationMessage.propertyPhotos.invalidlength,
  })
  public propertyPhotos!: Array<string>;

  @IsBoolean({ message: OfferValidationMessage.premiumFlag.type })
  public premiumFlag!: boolean;

  // favorite_flag!: '';
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 1 },
    { message: OfferValidationMessage.rating.invalidFormat }
  )
  @Min(1, { message: OfferValidationMessage.rating.minValue })
  @Max(5, { message: OfferValidationMessage.rating.maxValue })
  public rating!: number;

  @IsEnum(PropertyType, {
    message: OfferValidationMessage.propertyType.invalid,
  })
  public propertyType!: PropertyType;

  @Type(() => Number)
  @IsInt({ message: OfferValidationMessage.roomsNumber.invalidFormat })
  @Min(1, { message: OfferValidationMessage.roomsNumber.minValue })
  @Max(8, { message: OfferValidationMessage.roomsNumber.maxValue })
  public roomsNumber!: number;

  @Type(() => Number)
  @IsInt({ message: OfferValidationMessage.guestsNumber.invalidFormat })
  @Min(1, { message: OfferValidationMessage.guestsNumber.minValue })
  @Max(10, { message: OfferValidationMessage.guestsNumber.maxValue })
  public guestsNumber!: number;

  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: OfferValidationMessage.rentalCost.invalidFormat }
  )
  @Min(100, { message: OfferValidationMessage.rentalCost.minValue })
  @Max(100000, { message: OfferValidationMessage.rentalCost.maxValue })
  public rentalCost!: number;

  @IsArray({ message: OfferValidationMessage.features.invalidFormat })
  @ArrayMinSize(1, {
    message: OfferValidationMessage.features.minValue,
  })
  @ArrayMaxSize(Object.values(PropertyFeature).length, {
    message: OfferValidationMessage.features.maxValue,
  })
  @IsEnum(PropertyFeature, {
    each: true,
    message: OfferValidationMessage.features.invalidValue,
  })
  public features!: Array<PropertyFeature>;

  @IsMongoId({ message: OfferValidationMessage.userId.invalidId })
  public userId!: string;

  @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : value))
  @IsArray({ message: OfferValidationMessage.coordinates.invalidFormat })
  @ArrayMinSize(2, {
    message: OfferValidationMessage.coordinates.invalidLength,
  })
  @ArrayMaxSize(2, {
    message: OfferValidationMessage.coordinates.invalidLength,
  })
  @IsNumber(
    {},
    {
      each: true,
      message: OfferValidationMessage.coordinates.invalidArrayItemFormat,
    }
  )
  public coordinates!: [number, number];

  @Type(() => Number)
  @IsInt({ message: OfferValidationMessage.commentsCount.invalidFormat })
  public commentsCount!: number;
}

// try to use objectId
// create own custom id and use it everywhere or create cust id helper to work with id from mongoose, mongoose has own helpers to solve this issue
