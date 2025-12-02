import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';

export interface OfferService {
  create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
  find(limit?: number): Promise<Array<DocumentType<OfferEntity> | null>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(
    offerId: string,
    dto: UpdateOfferDTO
  ): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
