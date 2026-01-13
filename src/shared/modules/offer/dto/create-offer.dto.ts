import {
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  Max,
  IsNumber,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
  Length,
  IsUrl,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  PropertyType,
  PropertyFeature,
  CityData,
} from '../../../types/index.js';
import { OfferValidationMessage } from './offer-validation.messages.js';

export class CreateOfferDTO {
  @IsString({ message: OfferValidationMessage.title.invalidFormat })
  @Length(10, 100, { message: OfferValidationMessage.title.length })
  public title!: string;

  @IsString({ message: OfferValidationMessage.description.invalidFormat })
  @Length(20, 1024, {
    message: OfferValidationMessage.description.length,
  })
  public description!: string;

  @IsObject({ message: OfferValidationMessage.city.invalid })
  @ValidateNested()
  @Type(() => Object)
  public city!: CityData;

  @IsUrl()
  public previewImage!: string;

  @IsArray()
  @ArrayMinSize(6)
  @ArrayMaxSize(6)
  @IsUrl({}, { each: true })
  public propertyPhotos!: Array<string>;

  @IsBoolean({ message: OfferValidationMessage.premiumFlag.type })
  @Type(() => Boolean)
  public premiumFlag!: boolean;

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
}
