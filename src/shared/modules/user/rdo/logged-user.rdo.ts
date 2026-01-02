/* eslint-disable indent */
import { Expose } from 'class-transformer';

export class LoggedUserRdo {
  @Expose()
  public id!: string;

  @Expose()
  public token!: string;
}
