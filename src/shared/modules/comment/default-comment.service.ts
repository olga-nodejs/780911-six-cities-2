import { injectable, inject } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { Logger } from '../../libs/Logger/index.js';

import { Component } from '../../types/component.enum.js';
import { CommentService } from './comment-service.interface.js';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDTO } from './dto/create-comment.dto.js';
import { OfferEntity } from '../offer/index.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel)
    private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}
  // TODO: comment creation is done by logged users only

  public async updateCommentCount(offerId: string): Promise<void> {
    const commentCount = await this.commentModel
      .aggregate([
        { $match: { offerId: new Types.ObjectId(offerId) } },
        { $count: 'commentCount' },
      ])
      .exec();

    await this.offerModel.findByIdAndUpdate(offerId, {
      $set: { commentCount },
    });
  }

  private async updateOfferRating(offerId: string) {
    const aggrRating = await this.commentModel
      .aggregate([
        { $match: { offerId: new Types.ObjectId(offerId) } },
        { $group: { _id: null, rating: { $avg: '$rating' } } },
      ])
      .exec();

    const rating = aggrRating[0]?.rating ?? 0;

    const roundedAvg = Math.round(rating * 10) / 10;
    const updatedOffer = await this.offerModel.findByIdAndUpdate(
      offerId,
      {
        rating: roundedAvg,
      },
      { new: true }
    );
    console.log({ updatedOffer });
    return updatedOffer?.rating;
  }

  public async create(
    dto: CreateCommentDTO
  ): Promise<DocumentType<CommentEntity>> {
    const newComment = await this.commentModel.create(dto);

    await this.updateOfferRating(dto.offerId);
    await this.updateCommentCount(dto.offerId);
    await this.offerModel;

    this.logger.info(
      `New comment created: ${newComment._id} to an offer ${dto.offerId}`
    );
    return newComment;
  }
}
