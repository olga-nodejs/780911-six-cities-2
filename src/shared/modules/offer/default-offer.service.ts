import { injectable, inject } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { Logger } from '../../libs/Logger/index.js';

import { Component } from '../../types/component.enum.js';

import { OfferEntity } from './offer.entity.js';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const offer = new OfferEntity(dto);

    const res = await this.offerModel.create(offer);
    this.logger.info(`New offer ${dto.title} created `);
    return res;
  }

  public async find(limit = 60) {
    return this.offerModel
      .find()
      .sort({ publicationDate: -1 })
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
}
