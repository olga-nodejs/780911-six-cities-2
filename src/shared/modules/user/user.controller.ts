import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/Logger/index.js';
import { UserService } from './user-service.interface.js';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { fillDTO } from '../../helpers/common.js';
import { UserRdo } from './rdo/user.rdo.js';
import { Config } from '../../libs/config/config.interface.js';
import { RestSchema } from '../../libs/config/rest.schema.js';

//TODO: users should be unique by email
// TODO: add Тип пользователя. Обязательное. Возможные варианты: обычный, pro.
// TODO: default image for user. How to do
@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>
  ) {
    super(logger);

    this.logger.info('Register routes for userController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
    });
  }

  public async create({ body }: Request, res: Response): Promise<void> {
    const user = await this.userService.create(
      body as CreateUserDTO,
      this.configService.get('SALT')
    );
    const responseData = fillDTO(UserRdo, user);
    this.created(res, responseData);
  }
}
