import { RestApplicationInterface } from './rest.interface.js';
import { type Logger } from '../shared/libs/Logger/index.js';
import { inject, injectable } from 'inversify';
import { Component } from '../shared/types/index.js';
import { Config } from '../shared/libs/config/config.interface.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';

@injectable()
export class RestApplication implements RestApplicationInterface {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {}

  init() {
    this.logger.info(`PORT: ${this.config.get('PORT')}`);
    this.logger.info('Application initialization');
  }
}
