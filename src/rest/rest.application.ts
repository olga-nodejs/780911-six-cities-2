import express, { Express } from 'express';
import { RestApplicationInterface } from './rest.interface.js';
import { type Logger } from '../shared/libs/Logger/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../shared/types/index.js';
import { RestSchema, Config } from '../shared/libs/config/index.js';
import { getMongoURI } from '../shared/helpers/common.js';
import { DBClient } from '../shared/libs/db-client/db-client.interface.js';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.js';

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
    private readonly appExceptionFilter: ExceptionFilter
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
    this.server.use(express.json());
  }

  private async initExceptionFilter() {
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
    await this.initExceptionFilter();
    this.logger.info('Exception filter initialization completed');

    this.logger.info('Server initialization started');
    await this.initServer();
    this.logger.info('Server initialization completed');

    this.logger.info(
      `🚀 Server started on http://localhost:${this.config.get('PORT')}`
    );
  }
}
