import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
/* eslint-disable indent */
export class CommentRdo {
  @Expose()
  @Transform((value) => value.obj._id.toString())
  _id!: ObjectId;

  @Expose()
  public text!: string;

  @Expose()
  public publicationDate!: Date;
}

/* eslint-disable indent */
