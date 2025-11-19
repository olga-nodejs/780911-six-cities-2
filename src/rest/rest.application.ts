import { RestApplicationInterface } from './rest.interface.js';
import { type Logger } from '../shared/libs/Logger/index.js';

export class RestApplication implements RestApplicationInterface {
  constructor(private readonly logger: Logger) {}

  init() {
    this.logger.info('Application initialization');
  }
}
