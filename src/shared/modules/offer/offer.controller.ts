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
  CreateCommentRequest,
} from '../comment/index.js';
import {
  HttpMethod,
  BaseController,
  ValidateObjectIdMiddleware,
  ValidateDtoMiddleware,
  DocumentExistsMiddleware,
  UploadMultipleFilesMiddleware,
  ValidateImagesMiddleware,
} from '../../libs/rest/index.js';
import { fillDTO } from '../../helpers/common.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import { Config } from '../../libs/config/config.interface.js';

// TODO: add pagination to offers
@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.Config)
    private readonly configService: Config<RestSchema>,
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
      middlewares: [
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
            isRequired: true,
          },
          {
            name: OfferFileFields.propertyPhotos,
            maxCount: 6,
            isRequired: true,
          },
        ]),
        new ValidateDtoMiddleware(CreateOfferDTO),
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
        new ValidateDtoMiddleware(UpdateOfferDTO),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
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
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(CreateCommentDTO),
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
    const { body } = req;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const offerData = {
      ...body,
      propertyPhotos: files?.propertyPhotos?.map((f) => f.path) ?? [],
      previewImage: files?.previewImage?.[0]?.path,
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
    req: Request<ParamOfferId, unknown, UpdateOfferDTO>,
    res: Response
  ): Promise<void> {
    const { params, body } = req;
    const { offerId } = params;
    const files = req.files as
      | {
          previewImage?: Express.Multer.File[];
          propertyPhotos?: Express.Multer.File[];
        }
      | undefined;

    const updateDto: Partial<UpdateOfferDTO> = {
      ...body,
    };

    if (files?.previewImage?.length) {
      updateDto.previewImage = files.previewImage[0].path;
    }

    if (files?.propertyPhotos?.length) {
      updateDto.propertyPhotos = files.propertyPhotos.map((f) => f.path);
    }

    const offer = await this.offerService.updateById({
      offerId,
      dto: updateDto,
    });
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
