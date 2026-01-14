import {
  defaultClasses,
  getModelForClass,
  prop,
  modelOptions,
  Ref,
} from '@typegoose/typegoose';
import { Comment } from '../../types/index.js';
import { UserEntity } from '../user/index.js';
import { OfferEntity } from '../offer/index.js';

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  },
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public text!: string;

  @prop({ default: () => new Date() })
  public publicationDate!: Date;

  @prop({ required: true })
  public rating!: number;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId!: Ref<UserEntity>;

  @prop({
    ref: OfferEntity,
    required: true,
  })
  public offerId!: Ref<OfferEntity>;

  constructor(commentData: Comment) {
    super();
    const { text, publicationDate, rating, userId, offerId } = commentData;
    this.text = text;
    this.publicationDate = publicationDate
      ? new Date(publicationDate)
      : new Date();
    this.rating = rating;
    this.userId = userId as unknown as Ref<UserEntity>;
    this.offerId = offerId as unknown as Ref<OfferEntity>;
  }
}

export const CommentModel = getModelForClass(CommentEntity);
