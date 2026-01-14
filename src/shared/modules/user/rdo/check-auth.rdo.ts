/* eslint-disable indent */
import { Expose } from 'class-transformer';

export class CheckAuthUserRdo {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public token!: string;

  @Expose()
  public avatar!: string;
}
