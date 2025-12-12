import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
/* eslint-disable indent */

export class UserRdo {
  @Expose()
  @Transform((value) => value.obj._id.toString())
  _id!: ObjectId;

  @Expose()
  public name!: string;

  @Expose()
  public image!: string;
}

/* eslint-disable indent */
