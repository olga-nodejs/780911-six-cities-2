import {
  prop,
  getModelForClass,
  defaultClasses,
  Ref,
  modelOptions,
} from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
import {
  City,
  PropertyType,
  PropertyFeature,
  Offer,
} from '../../types/index.js';
// import { CommentEntity } from '../comment/comment.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public title!: string;

  @prop({ required: true, default: '' })
  public description!: string;

  @prop({ required: true })
  public publicationDate!: Date;

  @prop({
    type: () => String,
    enum: City,
  })
  public city!: City;

  @prop()
  public previewImage!: string;

  @prop({ type: () => [String], required: true })
  public propertyPhotos!: Array<string>;

  @prop({ required: true })
  public premiumFlag!: boolean;

  // favorite_flag: '';
  @prop({ required: true })
  public rating!: number;

  @prop({
    type: () => String,
    enum: PropertyType,
  })
  public propertyType!: PropertyType;

  @prop({ required: true })
  public roomsNumber!: number;

  @prop({ required: true })
  public guestsNumber!: number;

  @prop({ required: true })
  public rentalCost!: number;

  @prop({
    type: () => String,
    enum: PropertyFeature,
  })
  public features!: Array<PropertyFeature>;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId!: Ref<UserEntity>;

  @prop({ type: () => [Number], required: true })
  public coordinates!: [number, number];

  @prop({ required: true })
  public commentsCount!: number;

  constructor(offerData: Offer) {
    super();

    this.title = offerData.title;
    this.description = offerData.description ?? '';
    this.publicationDate = offerData.publicationDate;
    this.city = offerData.city;
    this.previewImage = offerData.previewImage ?? '';
    this.propertyPhotos = offerData.propertyPhotos ?? [];
    this.premiumFlag = offerData.premiumFlag;
    this.rating = offerData.rating;
    this.propertyType = offerData.propertyType;
    this.roomsNumber = offerData.roomsNumber;
    this.guestsNumber = offerData.guestsNumber;
    this.rentalCost = offerData.rentalCost;
    this.features = offerData.features ?? [];
    this.userId = offerData.userId as unknown as Ref<UserEntity>;
    this.coordinates = offerData.coordinates;
    this.commentsCount = offerData.commentsCount;
  }
}

export const OfferModel = getModelForClass(OfferEntity);
