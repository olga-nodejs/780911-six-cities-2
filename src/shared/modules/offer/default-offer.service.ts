import { injectable, inject } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { Logger } from '../../libs/Logger/index.js';

import { Component, SortType } from '../../types/index.js';

import { OfferEntity } from './offer.entity.js';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';
import { CommentEntity } from '../comment/comment.entity.js';

const DEFAULT_OFFER_COUNT = 60;
const DEFAULT_PREMIUM_OFFER_COUNT = 3;
//TODO: update imports in index
@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const offer = new OfferEntity(dto);

    const res = await this.offerModel.create(offer);
    this.logger.info(`New offer ${dto.title} created `);
    return res;
  }

  public async find(limit = DEFAULT_OFFER_COUNT) {
    return this.offerModel
      .find()
      .sort({ publicationDate: SortType.Down })
      .limit(limit)
      .populate('userId')
      .exec();
  }

  public async findById(offerId: string) {
    return this.offerModel.findById(offerId).exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDTO) {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate('userId')
      .exec();
  }

  public async deleteById(offerId: string) {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async findComments(offerId: string) {
    const offer = await this.offerModel.findById(offerId).exec();

    if (!offer) {
      throw new Error(`Offer with id ${offerId} not found`);
    }
    return this.commentModel
      .find({ _id: { $in: offer.comments } })
      .populate('userId') //TODO: how to get user data? Currently it gives only id
      .exec();
  }

  public async findPremium(city: string, limit = DEFAULT_PREMIUM_OFFER_COUNT) {
    return this.offerModel
      .find({ city, premiumFlag: true })
      .sort({ createdAt: SortType.Down })
      .limit(limit)
      .populate(['userId'])
      .exec();
  }
}

//TODO: add количество комментариев to offers result in findPremium, find
