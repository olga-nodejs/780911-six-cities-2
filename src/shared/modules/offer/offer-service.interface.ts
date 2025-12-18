import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';
import { CommentEntity } from '../comment/comment.entity.js';
import { City } from '../../types/index.js';

export interface OfferService {
  exists(documentId: string): Promise<boolean>;
  create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
  find({
    city,
    limit,
  }: {
    city?: City;
    limit?: number;
  }): Promise<Array<DocumentType<OfferEntity> | null>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById({
    offerId,
    dto,
  }: {
    offerId: string;
    dto: UpdateOfferDTO;
  }): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findComments(
    offerId: string
  ): Promise<Array<DocumentType<CommentEntity> | null>>;
  findPremium({
    city,
    limit,
  }: {
    city: City;
    limit?: number;
  }): Promise<Array<DocumentType<OfferEntity> | null>>;
}
