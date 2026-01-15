import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

/* eslint-disable indent */
export class FavoriteRDO {
  @Expose()
  @Transform((value) => value.obj._id.toString())
  _id!: ObjectId;

  @Expose()
  public title!: string;

  @Expose()
  public propertyType!: string;

  @Expose()
  public publicationDate!: Date;

  @Expose()
  public city!: string;

  @Expose()
  public previewImage!: string;

  @Expose()
  public premiumFlag!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public commentsCount!: number;

  @Expose()
  public isFavorite!: boolean;
}
