import { injectable, inject } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { Logger } from '../../libs/logger-temp/index.js';

import {
  Component,
  SortType,
  DocumentExists,
  ALLOWED_UPDATE_FIELDS,
  CityKey,
} from '../../types/index.js';

import {
  UpdateOfferDTO,
  OfferService,
  CreateOfferDTO,
  OfferEntity,
  OfferCount,
} from './index.js';
import { CommentEntity } from '../comment/index.js';
import { UserEntity } from '../user/index.js';
import { FilterQuery } from 'mongoose';

@injectable()
export class DefaultOfferService implements OfferService, DocumentExists {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async exists(documentId: string): Promise<boolean> {
    const count = await this.offerModel
      .countDocuments({ _id: documentId })
      .exec();
    return count > 0;
  }

  public async create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const userExists = await this.userModel.exists({ _id: dto.userId });

    if (!userExists) {
      throw new Error('User does not exist or was deleted');
    }
    const offer = new OfferEntity(dto);

    const res = await this.offerModel.create(offer);
    this.logger.info(`New offer ${dto.title} created `);
    return res;
  }

  public async find({
    city,
    limit = OfferCount.Default,
    userId,
  }: {
    city: CityKey;
    limit?: number;
    userId?: string;
  }) {
    const query: FilterQuery<OfferEntity> = {};
    let favorites: string[] = [];
    if (city) {
      query['city.name'] = city;
    }

    if (userId) {
      const user = await this.userModel.findById(userId).lean();
      favorites = user?.favorites ?? [];
    }

    const offers = await this.offerModel
      .find(query)
      .sort({ publicationDate: SortType.Down, _id: 1 })
      .limit(limit)
      .populate('userId')
      .lean()
      .exec();

    return offers.map((offer) => ({
      ...offer,
      isFavorite: favorites.includes(offer._id.toString()),
    }));
  }

  public async findById(offerId: string) {
    return this.offerModel.findById(offerId).populate('userId').exec();
  }

  public async updateById({
    offerId,
    userId,
    dto,
  }: {
    offerId: string;
    userId: string;
    dto: UpdateOfferDTO;
  }) {
    type AllowedUpdateField = (typeof ALLOWED_UPDATE_FIELDS)[number];

    const updateData = Object.fromEntries(
      Object.entries(dto).filter(
        ([key, value]) =>
          value !== undefined &&
          ALLOWED_UPDATE_FIELDS.includes(key as AllowedUpdateField)
      )
    );
    const updatedOffer = await this.offerModel
      .findOneAndUpdate(
        {
          _id: offerId,
          userId: userId,
        },
        {
          $set: updateData,
        },
        { new: true }
      )
      .populate('userId')
      .exec();

    if (!updatedOffer) {
      throw new Error('Forbidden to modify the offer or the offer not found');
    }

    return updatedOffer;
  }

  public async deleteById({
    offerId,
    userId,
  }: {
    offerId: string;
    userId: string;
  }) {
    const deletedOffer = await this.offerModel
      .findOneAndDelete({
        _id: offerId,
        userId: userId,
      })
      .exec();

    if (!deletedOffer) {
      throw new Error('Forbidden to delete the offer or the offer not found');
    }

    return deletedOffer;
  }

  public async findPremium({
    city,
    limit = OfferCount.Premium,
  }: {
    city: CityKey;
    limit: number;
  }) {
    return this.offerModel
      .find({ 'city.name': city, premiumFlag: true })
      .sort({ createdAt: SortType.Down, _id: 1 })
      .limit(limit)
      .populate(['userId'])
      .exec();
  }

  public async findComments(offerId: string) {
    return this.commentModel.find({ offerId });
  }
}
