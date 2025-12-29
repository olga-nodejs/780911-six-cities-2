import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpError,
  HttpMethod,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';

import { Logger } from '../../libs/Logger/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import {
  UserService,
  LoginUserRequest,
  LoginUserDto,
  CreateUserRequest,
  UserRdo,
  CreateUserDTO,
  LoggedUserRdo,
} from './index.js';
import { Component } from '../../types/index.js';
import { fillDTO } from '../../helpers/common.js';
import { AuthService } from '../auth/index.js';

// TODO: login
@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config)
    private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService
  ) {
    super(logger);

    this.logger.info('Register routes for userController…');

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });

    this.addRoute({
      path: '/registrate',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new UploadFileMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'image'
        ),
        new ValidateDtoMiddleware(CreateUserDTO),
      ],
    });

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'avatar'
        ),
      ],
    });
  }

  public async create(
    { body, file }: CreateUserRequest,
    res: Response
  ): Promise<void> {
    const userData = {
      ...body,
      image: file?.path
        ? file.path
        : this.configService.get('DEFAULT_USER_IMAGE'),
    };
    const user = await this.userService.create(
      userData as CreateUserDTO,
      this.configService.get('SALT')
    );
    const responseData = fillDTO(UserRdo, user);
    this.created(res, responseData);
  }

  public async login({ body }: LoginUserRequest, res: Response): Promise<void> {
    const user = await this.authService.authenticate(body);

    const token = await this.authService.issueToken(user);

    const responseData = fillDTO(LoggedUserRdo, { id: user.id, token });

    this.ok(res, responseData);
  }

  public async uploadAvatar(req: Request, res: Response) {
    if (!req.file) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'No file uploaded');
    }

    const updatedUser = await this.userService.updateAvatar(
      req.params.userId,
      req.file.path
    );

    this.created(res, {
      image: updatedUser.image,
    });
  }
}
