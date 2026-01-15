import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { UserRdo } from '../../user/index.js';
import { CityData } from '../../../types/city.js';

/* eslint-disable indent */
export class OfferRDO {
  @Expose()
  @Transform((value) => value.obj._id.toString())
  _id!: ObjectId;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public publicationDate!: Date;

  @Expose()
  @Transform(({ obj }) => {
    const { name, location } = obj.city;
    return {
      name,
      location,
    };
  })
  public city!: CityData;

  @Expose()
  public previewImage!: string;

  @Expose()
  public propertyPhotos!: Array<string>;

  @Expose()
  public premiumFlag!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public propertyType!: string;

  @Expose()
  public roomsNumber!: number;

  @Expose()
  public guestsNumber!: number;

  @Expose()
  public rentalCost!: number;

  @Expose()
  public features!: Array<string>;

  @Expose()
  public coordinates!: [number, number];

  @Expose()
  public commentsCount!: number;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  @Transform(({ obj }) => {
    if (!obj.userId) {
      return null;
    }

    const { _id, name, avatar, userType, email } = obj.userId;

    return {
      _id: _id?.toString(),
      name,
      avatar,
      userType,
      email,
    };
  })
  public user!: UserRdo | null;
}
