import { Expose } from 'class-transformer';

export class FavoriteRDO {
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
