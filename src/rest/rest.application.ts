import { RestApplicationInterface } from './rest.interface.js';
import { type Logger } from '../shared/libs/Logger/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../shared/types/index.js';
import { Config } from '../shared/libs/config/config.interface.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { getMongoURI } from '../shared/helpers/common.js';
import { DBClient } from '../shared/libs/db-client/db-client.interface.js';

@injectable()
export class RestApplication implements RestApplicationInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DBClient) private readonly db: DBClient
  ) {}

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

  async init() {
    this.logger.info(`PORT: ${this.config.get('PORT')}`);
    this.logger.info('Application initialization started');
    this.logger.info('DB initialization started');
    await this.initDB();
    this.logger.info('DB initialization completed');
  }
}
