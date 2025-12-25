import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
import { UserRdo } from '../../user/index.js';

/* eslint-disable indent */
export class OfferRdo {
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
  public city!: string;

  @Expose()
  public previewImage!: string;

  @Expose()
  public propertyPhotos!: Array<string>;

  @Expose()
  public premiumFlag!: boolean;

  // favorite_flag!: '';
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
  @Transform(({ obj }) => {
    if (!obj.userId) {
      return null;
    }

    const { _id, name, image, userType } = obj.userId;

    return {
      _id: _id?.toString(),
      name,
      image,
      userType,
    };
  })
  public user!: UserRdo | null;
}
