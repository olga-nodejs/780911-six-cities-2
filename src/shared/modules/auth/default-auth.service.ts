import { inject, injectable } from 'inversify';
import * as crypto from 'node:crypto';
import { SignJWT } from 'jose';
import {
  AuthService,
  JWT_CONFIG,
  TokenPayload,
  UserNotFoundException,
  UserPasswordIncorrectException,
} from './index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/Logger/index.js';
import { LoginUserDTO, UserEntity, UserService } from '../user/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.UserService) private readonly userService: UserService
  ) {}

  public async issueToken(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');

    const tokenPayload: TokenPayload = {
      email: user.email,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);

    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_CONFIG.AlgorithmHS256 })
      .setIssuedAt()
      .setExpirationTime(JWT_CONFIG.ExpiresIn)
      .sign(secretKey);
  }

  public async authenticate(dto: LoginUserDTO): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
