import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { CityKey, Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import {
  OfferService,
  OfferCount,
  ParamOfferId,
  UpdateOfferDTO,
  OfferRDO,
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
  PrivateRouteMiddleware,
} from '../../libs/rest/index.js';
import { fillDTO } from '../../helpers/common.js';
import { UserService } from '../user/index.js';
import { PathTransformerInterface } from '../../libs/rest/transform/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
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
        new PrivateRouteMiddleware(),
        new ValidateDTOMiddleware(CreateOfferDTO),
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

  public async index(
    { query, tokenPayload }: Request,
    res: Response
  ): Promise<void> {
    const limit = Number(query.limit) || OfferCount.Default;
    const city = query.city as CityKey;
    const userId = tokenPayload?.id;
    const offers = await this.offerService.find({ city, limit, userId });

    const responseData = fillDTO(OfferRDO, offers);
    this.ok(res, responseData);
  }

  public async create(req: CreateOfferRequest, res: Response): Promise<void> {
    const { body, tokenPayload } = req;

    const offerData = {
      ...body,
      userId: tokenPayload.id,
    };

    const offer = await this.offerService.create(offerData);
    const responseData = fillDTO(OfferRDO, offer);
    this.created(res, responseData);
  }

  public async getPremium({ query }: Request, res: Response): Promise<void> {
    const city = query.city as CityKey;

    const limit = Number(query.limit) || OfferCount.Premium;

    const offers = await this.offerService.findPremium({ city, limit });

    const responseData = fillDTO(OfferRDO, offers);
    this.ok(res, responseData);
  }

  public async show(
    { params }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);

    const responseData = fillDTO(OfferRDO, offer);

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

    const offer = await this.offerService.updateById({
      offerId,
      userId,
      dto: body,
    });

    const responseData = fillDTO(OfferRDO, offer);
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
    const responseData = fillDTO(OfferRDO, offer);

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
