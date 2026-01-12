import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { City, Component, OfferFileFields } from '../../types/index.js';
import { Logger } from '../../libs/Logger/index.js';
import {
  OfferService,
  OfferCount,
  ParamOfferId,
  UpdateOfferDTO,
  OfferRdo,
  CreateOfferRequest,
  CreateOfferDTO,
} from '../offer/index.js';
import {
  CommentRdo,
  CommentService,
  CreateCommentDTO,
} from '../comment/index.js';
import {
  HttpMethod,
  BaseController,
  ValidateObjectIdMiddleware,
  ValidateDTOMiddleware,
  DocumentExistsMiddleware,
  UploadMultipleFilesMiddleware,
  ValidateImagesMiddleware,
  PrivateRouteMiddleware,
} from '../../libs/rest/index.js';
import { fillDTO } from '../../helpers/common.js';
import { RestSchema, Config } from '../../libs/config/index.js';
import { UserService } from '../user/index.js';
import { PathTransformerInterface } from '../../libs/rest/transform/index.js';
import { LoggerMiddleware } from '../../libs/rest/middleware/loggerMiddleware.js';

function buildOfferUpdateDTO(
  body: UpdateOfferDTO,
  files?: {
    previewImage?: Express.Multer.File[];
    propertyPhotos?: Express.Multer.File[];
  }
): Partial<UpdateOfferDTO> {
  const dto: Partial<UpdateOfferDTO> = { ...body };

  if (files?.previewImage?.length) {
    dto.previewImage = files.previewImage[0].filename;
  }

  if (files?.propertyPhotos?.length) {
    dto.propertyPhotos = files.propertyPhotos.map((f) => f.filename);
  }

  return dto;
}

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.Config)
    private readonly configService: Config<RestSchema>,
    @inject(Component.CommentService)
    private readonly commentService: CommentService,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.PathTransformer) pathTranformer: PathTransformerInterface
  ) {
    super(logger, pathTranformer);

    this.logger.info('Register routes for OfferController…');
    // GET /offers?limit=5
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new LoggerMiddleware(),
        new PrivateRouteMiddleware(),
        new ValidateDTOMiddleware(CreateOfferDTO),
        new LoggerMiddleware(),
      ],
    });
    // GET /offers/premium?city=Paris&limit=10
    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremium,
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadMultipleFilesMiddleware(
          this.configService.get('UPLOAD_DIRECTORY'),
          [
            { name: OfferFileFields.previewImage, maxCount: 1 },
            { name: OfferFileFields.propertyPhotos, maxCount: 6 },
          ]
        ),
        new ValidateImagesMiddleware([
          {
            name: OfferFileFields.previewImage,
            maxCount: 1,
            isRequired: false,
          },
          {
            name: OfferFileFields.propertyPhotos,
            maxCount: 6,
            isRequired: false,
          },
        ]),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDTOMiddleware(UpdateOfferDTO),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.addComment,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDTOMiddleware(CreateCommentDTO),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId/favorites',
      method: HttpMethod.Post,
      handler: this.addFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId/favorites',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async index({ query }: Request, res: Response): Promise<void> {
    const limit = Number(query.limit) || OfferCount.Default;
    const city = query.city as City;
    const offers = await this.offerService.find({ city, limit });

    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(req: CreateOfferRequest, res: Response): Promise<void> {
    const { body, tokenPayload } = req;

    const offerData = {
      ...body,
      userId: tokenPayload.id,
    };

    const offer = await this.offerService.create(offerData);
    const responseData = fillDTO(OfferRdo, offer);
    this.created(res, responseData);
  }

  public async getPremium({ query }: Request, res: Response): Promise<void> {
    const city = query.city as City;
    const limit = Number(query.limit) || OfferCount.Default;
    const offers = await this.offerService.findPremium({ city, limit });
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async show(
    { params }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    const responseData = fillDTO(OfferRdo, offer);

    this.ok(res, responseData);
  }

  public async getComments(
    { params }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const comments = await this.offerService.findComments(params.offerId);
    const responseData = fillDTO(CommentRdo, comments);

    this.ok(res, responseData);
  }

  public async addComment(
    {
      body,
      tokenPayload,
      params,
    }: Request<ParamOfferId, unknown, CreateCommentDTO>,
    res: Response
  ): Promise<void> {
    const { id: userId } = tokenPayload;
    const comment = await this.commentService.create({
      dto: body,
      userId,
      offerId: params.offerId,
    });
    const responseData = fillDTO(CommentRdo, comment);
    this.created(res, responseData);
  }

  public async update(
    req: Request<ParamOfferId, unknown, UpdateOfferDTO>,
    res: Response
  ): Promise<void> {
    const { params, body, tokenPayload } = req;

    const { offerId } = params;
    const { id: userId } = tokenPayload;

    const files = req.files as
      | {
          previewImage?: Express.Multer.File[];
          propertyPhotos?: Express.Multer.File[];
        }
      | undefined;

    const updateDTO = buildOfferUpdateDTO(body, files);

    const offer = await this.offerService.updateById({
      offerId,
      userId,
      dto: updateDTO,
    });
    const responseData = fillDTO(OfferRdo, offer);

    this.ok(res, responseData);
  }

  public async delete(
    { params, tokenPayload }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const { id: userId } = tokenPayload;
    const offer = await this.offerService.deleteById({ offerId, userId });

    await this.commentService.deleteByOfferId(offerId);
    await this.userService.removeFavoriteFromMany(offerId);
    const responseData = fillDTO(OfferRdo, offer);

    this.noContent(res, responseData);
  }

  public async addFavorite(
    { params, tokenPayload }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const { id: userId } = tokenPayload;

    const responseData = await this.userService.addFavorite({
      userId,
      offerId,
    });

    this.created(res, responseData);
  }

  public async deleteFavorite(
    { params, tokenPayload }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const { id: userId } = tokenPayload;

    const responseData = await this.userService.deleteFavorite({
      userId,
      offerId,
    });

    this.noContent(res, responseData);
  }
}
