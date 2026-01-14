import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { OfferWithFavorite } from '../offer/index.js';

export interface UserService {
  create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(
    dto: CreateUserDTO,
    salt: string
  ): Promise<DocumentType<UserEntity>>;
  updateAvatar(
    documentId: string,
    filePath: string
  ): Promise<{ avatar: string }>;

  addFavorite({
    offerId,
    userId,
  }: {
    offerId: string;
    userId: string;
  }): Promise<DocumentType<UserEntity>>;

  deleteFavorite({
    offerId,
    userId,
  }: {
    offerId: string;
    userId: string;
  }): Promise<DocumentType<UserEntity>>;

  removeFavoriteFromMany(offerId: string): Promise<void>;

  getFavorites({
    userId,
  }: {
    userId: string;
  }): Promise<Array<OfferWithFavorite> | null>;
}
