import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { BaseController } from '../../../rest/index.js';
import { City, Component } from '../../types/index.js';
import { Logger } from '../../libs/Logger/index.js';
import {
  CreateOfferDTO,
  OfferService,
  OfferCount,
  ParamOfferId,
  UpdateOfferDTO,
  OfferRdo,
} from '../offer/index.js';
import { CommentService } from '../comment/index.js';
import { HttpMethod } from '../../libs/rest/types/index.js';
import { fillDTO } from '../../helpers/common.js';

// TODO: add return type for methods
// TODO: check that at the end I call something like this.ok(res, offers);
// TODO: add RDO to everything that returns offer/offers/comments
// TODO: add limit + pagination to offers

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
      method: HttpMethod.Delete,
      handler: this.delete,
    });

    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
    });
  }

  public async index({ query }: Request, res: Response): Promise<void> {
    const limit = Number(query.limit) || OfferCount.Default;
    const city = query.city as City;
    const offers = await this.offerService.find({ city, limit });

    const responseData = fillDTO(OfferRdo, offers);
    console.log(offers[0]);
    console.log('----------');
    console.log({ responseData });
    console.log('----------');
    this.ok(res, responseData);
  }

  public async create({ body }: Request, res: Response): Promise<void> {
    const offer = await this.offerService.create(body as CreateOfferDTO);
    const responseData = fillDTO(OfferRdo, offer);
    this.created(res, responseData);
  }

  public async getPremium({ query }: Request, res: Response): Promise<void> {
    const city = query.city as City;
    const limit = Number(query.limit) || OfferCount.Default;
    const offers = await this.offerService.findPremium({ city, limit });
    this.ok(res, offers);
  }

  public async show(
    { params }: Request<ParamOfferId>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);
    console.log({ offer });
    const responseData = fillDTO(OfferRdo, offer);
    console.log({ responseData });
    this.ok(res, responseData);
  }

  public async getComments({ params }: Request<ParamOfferId>, res: Response) {
    const comments = await this.offerService.findComments(params.offerId);
    this.ok(res, comments);
  }

  public async update(
    { params, body }: Request<ParamOfferId, unknown, UpdateOfferDTO>,
    res: Response
  ) {
    const { offerId } = params;
    const offer = await this.offerService.updateById({ offerId, dto: body });
    this.ok(res, offer);
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response) {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, offer);
  }
}
