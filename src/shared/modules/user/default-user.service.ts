import { injectable, inject } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { MongoServerError } from 'mongodb';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { Component, DocumentExists } from '../../types/index.js';
import { Logger } from '../../libs/Logger/index.js';
import { OfferEntity } from '../offer/offer.entity.js';

@injectable()
export class DefaultUserService implements UserService, DocumentExists {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(
    dto: CreateUserDTO,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);

    user.setPassword(dto.password, salt);

    try {
      const res = await this.userModel.create(user);

      this.logger.info(`New user created ${user.email}`);
      return res;
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new Error(`User with email ${user.email} already exists`);
      }

      throw error;
    }
  }

  public async exists(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email }).exec();
    return !!user;
  }

  public async findByEmail(
    email: string
  ): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(
    dto: CreateUserDTO,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const existingUser = await this.findByEmail(dto.email);
    if (existingUser) {
      return existingUser;
    }

    return this.create(dto, salt);
  }

  public async updateAvatar(userId: string, avatarPath: string) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { avatar: avatarPath },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error(`User with id ${userId} not found`);
    }

    return updatedUser;
  }

  public async getFavorites({ userId }: { userId: string }) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const { favorites } = user;

    if (favorites.length) {
      const offers = await this.offerModel
        .find({
          _id: { $in: user.favorites },
        })
        .lean();

      return offers.map((offer) => ({ ...offer, isFavorite: true }));
    }
    return [];
  }

  public async addFavorite({
    offerId,
    userId,
  }: {
    offerId: string;
    userId: string;
  }): Promise<DocumentType<UserEntity>> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: offerId } },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error(`User with id ${userId} not found`);
    }

    return updatedUser;
  }

  public async deleteFavorite({
    offerId,
    userId,
  }: {
    offerId: string;
    userId: string;
  }): Promise<DocumentType<UserEntity>> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $pull: { favorites: offerId },
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error(`User with id ${userId} not found`);
    }

    return updatedUser;
  }

  public async removeFavoriteFromMany(offerId: string): Promise<void> {
    await this.userModel.updateMany(
      { favorites: offerId },
      { $pull: { favorites: offerId } }
    );
  }
}
