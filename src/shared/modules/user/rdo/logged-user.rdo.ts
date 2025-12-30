/* eslint-disable indent */
import { Expose } from 'class-transformer';

// TODO: check what should be contained in token
export class LoggedUserRdo {
  @Expose()
  public id!: string;

  @Expose()
  public token!: string;
}
