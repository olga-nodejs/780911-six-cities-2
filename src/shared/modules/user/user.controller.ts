import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BaseController,
  HttpError,
  HttpMethod,
  UploadFileMiddleware,
  ValidateDTOMiddleware,
  ValidateObjectIdMiddleware,
  PrivateRouteMiddleware,
  AuthorizationErrorMessage,
  ValidateImagesMiddleware,
} from '../../libs/rest/index.js';

import { Logger } from '../../libs/Logger/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import {
  UserService,
  LoginUserRequest,
  LoginUserDTO,
  CreateUserRequest,
  UserRdo,
  CreateUserDTO,
  LoggedUserRdo,
} from './index.js';
import { Component } from '../../types/index.js';
import { fillDTO } from '../../helpers/common.js';
import { AuthService } from '../auth/index.js';
import { PathTransformerInterface } from '../../libs/rest/transform/index.js';
import { LoggerMiddleware } from '../../libs/rest/middleware/loggerMiddleware.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config)
    private readonly configService: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
    @inject(Component.PathTransformer) pathTranformer: PathTransformerInterface
  ) {
    super(logger, pathTranformer);

    this.logger.info('Register routes for userController…');

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new LoggerMiddleware(),
        new ValidateDTOMiddleware(LoginUserDTO),
        new LoggerMiddleware(),
      ],
    });

    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [new PrivateRouteMiddleware()],
    });

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new UploadFileMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'avatar'
        ),
        new ValidateDTOMiddleware(CreateUserDTO),
      ],
    });

    this.addRoute({
      path: 'users/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          'avatar'
        ),
        new ValidateImagesMiddleware([
          { name: 'avatar', maxCount: 1, isRequired: true },
        ]),
      ],
    });
  }

  public async create(
    { body, file }: CreateUserRequest,
    res: Response
  ): Promise<void> {
    const userData = {
      ...body,
      avatar: file?.filename,
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
    const { file, tokenPayload } = req;
    if (!file) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'No file uploaded');
    }

    const { id: userId } = tokenPayload;

    const updatedUser = await this.userService.updateAvatar(
      userId,
      file.filename
    );

    this.created(res, {
      avatar: updatedUser.avatar,
    });
  }

  public async checkAuthenticate(
    { tokenPayload: { email } }: Request,
    res: Response
  ) {
    const foundedUser = await this.userService.findByEmail(email);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        AuthorizationErrorMessage.unauthorized,
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }

  public async logout({ tokenPayload }: Request, res: Response): Promise<void> {
    this.noContent(res, tokenPayload.id);
  }
}
