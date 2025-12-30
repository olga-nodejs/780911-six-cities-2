import express, { Express } from 'express';
import mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { RestApplicationInterface } from './rest.interface.js';
import { type Logger } from '../shared/libs/Logger/index.js';
import { Component } from '../shared/types/index.js';
import { RestSchema, Config } from '../shared/libs/config/index.js';
import { getMongoURI } from '../shared/helpers/common.js';
import { DBClient } from '../shared/libs/db-client/index.js';
import {
  Controller,
  ExceptionFilter,
  ParseTokenMiddleware,
} from '../shared/libs/rest/index.js';
import { AuthExceptionFilter } from '../shared/modules/auth/index.js';

@injectable()
export class RestApplication implements RestApplicationInterface {
  private readonly server: Express;
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DBClient) private readonly db: DBClient,
    @inject(Component.OfferController)
    private readonly offerController: Controller,
    @inject(Component.UserController)
    private readonly userController: Controller,
    @inject(Component.ExceptionFilter)
    private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.AuthExceptionFilter)
    private readonly authExceptionFilter: AuthExceptionFilter
  ) {
    this.server = express();
  }

  private async initDB() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    mongoose.set('autoIndex', true);
    return this.db.connect(mongoUri);
  }

  private async initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
    console.log({ port });
  }

  private async initControllers() {
    this.server.use('/offers', this.offerController.router);
    this.server.use('/users', this.userController.router);
  }

  private async initMiddleware() {
    const authenticateMiddleware = new ParseTokenMiddleware(
      this.config.get('JWT_SECRET')
    );

    this.server.use(express.json());
    this.server.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.server.use(
      authenticateMiddleware.execute.bind(authenticateMiddleware)
    );
  }

  private async initExceptionFilters() {
    this.server.use(
      this.authExceptionFilter.catch.bind(this.authExceptionFilter)
    );
    this.server.use(
      this.appExceptionFilter.catch.bind(this.appExceptionFilter)
    );
  }

  async init() {
    this.logger.info(`PORT: ${this.config.get('PORT')}`);
    this.logger.info('⚙️ Application initialization started');

    this.logger.info('🗄️ DB initialization started');
    await this.initDB();
    this.logger.info('DB initialization completed');

    this.logger.info('Init app-level middleware');
    await this.initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Controller initialization started');
    await this.initControllers();
    this.logger.info('Controller initialization completed');

    this.logger.info('Init exception filter');
    await this.initExceptionFilters();
    this.logger.info('Exception filter initialization completed');

    this.logger.info('Server initialization started');
    await this.initServer();
    this.logger.info('Server initialization completed');

    this.logger.info(
      `🚀 Server started on http://localhost:${this.config.get('PORT')}`
    );
  }
}
