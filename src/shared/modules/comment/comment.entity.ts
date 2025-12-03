import {
  defaultClasses,
  getModelForClass,
  prop,
  modelOptions,
  Ref,
} from '@typegoose/typegoose';
import { Comment } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  },
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public text!: string;

  @prop({ required: true })
  public publicationDate!: Date;

  @prop({ required: true })
  public rating!: number;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId!: Ref<UserEntity>;

  constructor(commentData: Comment) {
    super();
    const { text, publicationDate, rating, userId } = commentData;
    this.text = text;
    this.publicationDate = publicationDate;
    this.rating = rating;
    this.userId = userId as unknown as Ref<UserEntity>;
  }
}

export const CommentModel = getModelForClass(CommentEntity);
