/* eslint-disable indent */
import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';
// TODO: check what should be contained in token
export class LoggedUserRdo {
  @Expose()
  @Transform((value) => value.obj._id.toString())
  _id!: ObjectId;

  @Expose()
  public email!: string;
}
