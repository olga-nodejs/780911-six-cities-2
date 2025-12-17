import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { City, Component } from '../../types/index.js';
import { Logger } from '../../libs/Logger/index.js';
import {
  OfferService,
  OfferCount,
  ParamOfferId,
  UpdateOfferDTO,
  OfferRdo,
  CreateOfferRequest,
} from '../offer/index.js';
import {
  CommentRdo,
  CommentService,
  CreateCommentDTO,
  CreateCommentRequest,
} from '../comment/index.js';
import { HttpMethod, BaseController } from '../../libs/rest/index.js';
import { fillDTO } from '../../helpers/common.js';

// TODO: add pagination to offers

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService)
    private readonly commentService: CommentService
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');
    // GET /offers?limit=5
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
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
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Post,
      handler: this.addComment,
    });
  }

  public async index({ query }: Request, res: Response): Promise<void> {
    const limit = Number(query.limit) || OfferCount.Default;
    const city = query.city as City;
    const offers = await this.offerService.find({ city, limit });

    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    { body }: CreateOfferRequest,
    res: Response
  ): Promise<void> {
    const offer = await this.offerService.create(body);
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
    console.log({ comments, responseData });
    this.ok(res, responseData);
  }

  public async addComment(
    { body }: CreateCommentRequest,
    res: Response
  ): Promise<void> {
    const comment = await this.commentService.create(body);
    const responseData = fillDTO(CommentRdo, comment);
    this.created(res, responseData);
  }

  public async update(
    { params, body }: Request<ParamOfferId, unknown, UpdateOfferDTO>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.updateById({ offerId, dto: body });
    const responseData = fillDTO(OfferRdo, offer);

    this.ok(res, responseData);
  }

  public async delete(
    { params }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    await this.commentService.deleteByOfferId(offerId);
    const responseData = fillDTO(OfferRdo, offer);

    this.noContent(res, responseData);
  }
}
