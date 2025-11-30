import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferService {
  create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
  find(): Promise<Array<DocumentType<OfferEntity> | null>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
