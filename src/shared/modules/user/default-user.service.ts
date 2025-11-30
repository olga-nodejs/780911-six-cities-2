import { injectable, inject } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/Logger/index.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel)
    private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(
    dto: CreateUserDTO,
    salt: string
  ): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const res = await this.userModel.create(user);
    this.logger.info(`New user created ${user.email}`);
    return res;
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
}
