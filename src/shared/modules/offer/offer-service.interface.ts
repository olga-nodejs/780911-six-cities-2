import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDTO } from './dto/update-offer.dto.js';
import { CommentEntity } from '../comment/comment.entity.js';
import { CityKey } from '../../types/index.js';
import { OfferWithFavorite } from './type/offer-with-favorite.type.js';

export interface OfferService {
  exists(documentId: string): Promise<boolean>;
  create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
  find({
    city,
    limit,
    userId,
  }: {
    city?: CityKey;
    limit?: number;
    userId?: string;
  }): Promise<Array<OfferWithFavorite> | null>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById({
    offerId,
    userId,
    dto,
  }: {
    offerId: string;
    userId: string;
    dto: UpdateOfferDTO;
  }): Promise<DocumentType<OfferEntity> | null>;
  deleteById({
    offerId,
    userId,
  }: {
    offerId: string;
    userId: string;
  }): Promise<DocumentType<OfferEntity> | null>;
  findComments(
    offerId: string
  ): Promise<Array<DocumentType<CommentEntity> | null>>;
  findPremium({
    city,
    limit,
  }: {
    city: CityKey;
    limit?: number;
  }): Promise<Array<DocumentType<OfferEntity> | null>>;
}
