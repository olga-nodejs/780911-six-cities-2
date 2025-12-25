import {
  IsDateString,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsNumber,
  // IsMongoId,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
  Length,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { City, PropertyType, PropertyFeature } from '../../../types/index.js';
import { OfferValidationMessage } from './offer-validation.messages.js';

export class UpdateOfferDTO {
  @IsOptional()
  @Length(10, 100, { message: OfferValidationMessage.title.length })
  public title?: string;

  @IsOptional()
  @Length(20, 1024, {
    message: OfferValidationMessage.description.length,
  })
  public description?: string;

  @IsDateString(
    {},
    { message: OfferValidationMessage.publicationDate.invalidFormat }
  )
  @IsOptional()
  public publicationDate?: Date;

  @IsEnum(City, {
    message: OfferValidationMessage.city.invalid,
  })
  @IsOptional()
  public city?: City;

  public previewImage?: string;

  public propertyPhotos?: Array<string>;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: OfferValidationMessage.premiumFlag.type })
  public premiumFlag?: boolean;

  // favorite_flag?: '';
  // @IsOptional()
  // @Type(() => Number)
  // @IsNumber(
  //   { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 1 },
  //   { message: OfferValidationMessage.rating.invalidFormat }
  // )
  // @Min(1, { message: OfferValidationMessage.rating.minValue })
  // @Max(5, { message: OfferValidationMessage.rating.maxValue })
  // public rating?: number;

  @IsOptional()
  @IsEnum(PropertyType, {
    message: OfferValidationMessage.propertyType.invalid,
  })
  public propertyType?: PropertyType;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: OfferValidationMessage.roomsNumber.invalidFormat })
  @Min(1, { message: OfferValidationMessage.roomsNumber.minValue })
  @Max(8, { message: OfferValidationMessage.roomsNumber.maxValue })
  public roomsNumber?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: OfferValidationMessage.guestsNumber.invalidFormat })
  @Min(1, { message: OfferValidationMessage.guestsNumber.minValue })
  @Max(10, { message: OfferValidationMessage.guestsNumber.maxValue })
  public guestsNumber?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: OfferValidationMessage.rentalCost.invalidFormat }
  )
  @Min(100, { message: OfferValidationMessage.rentalCost.minValue })
  @Max(100000, { message: OfferValidationMessage.rentalCost.maxValue })
  public rentalCost?: number;

  @IsOptional()
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
  public features?: Array<PropertyFeature>;

  // @IsMongoId({ message: OfferValidationMessage.userId.invalidId })
  // public userId!: string;

  @IsOptional()
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
  public coordinates?: [number, number];

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: OfferValidationMessage.commentsCount.invalidFormat })
  public commentsCount?: number;
}
