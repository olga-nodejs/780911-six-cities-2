import { injectable, inject } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { Logger } from '../../libs/logger/index.js';

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

  public async updateCommentsCount(offerId: string): Promise<void> {
    const result = await this.commentModel
      .aggregate([
        { $match: { offerId: new Types.ObjectId(offerId) } },
        { $count: 'commentsCount' },
      ])
      .exec();

    const commentsCount = result[0]?.commentsCount ?? 0;

    await this.offerModel.findByIdAndUpdate(offerId, {
      $set: { commentsCount },
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

    return updatedOffer?.rating;
  }

  public async create({
    offerId,
    userId,
    dto,
  }: {
    offerId: string;
    userId: string;
    dto: CreateCommentDTO;
  }): Promise<DocumentType<CommentEntity>> {
    const commentData = {
      ...dto,
      offerId,
      userId,
    };

    const newComment = await this.commentModel.create(commentData);

    await this.updateOfferRating(offerId);
    await this.updateCommentsCount(offerId);
    await this.offerModel;

    this.logger.info(
      `New comment created: ${newComment._id} to an offer ${offerId}`
    );
    return newComment;
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const comments = await this.commentModel.deleteMany({ offerId }).exec();
    this.logger.info(
      `Were deleted: ${comments.deletedCount} to an offer ${offerId}`
    );
    return comments.deletedCount;
  }
}
