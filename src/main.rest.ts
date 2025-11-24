import 'reflect-metadata';
import { Container } from 'inversify';
import dotenv from 'dotenv';

import { Logger, PinoLogger } from './shared/libs/Logger/index.js';
import { RestApplication } from './rest/index.js';

import { Component } from './shared/types/index.js';
import { Config } from './shared/libs/config/config.interface.js';
import { RestSchema } from './shared/libs/config/rest.schema.js';
import { RestConfig } from './shared/libs/config/rest.config.js';
import { NodeEnv } from './shared/types/index.js';

dotenv.config();
async function bootstrap() {
  const container = new Container();
  container
    .bind<RestApplication>(Component.RestApplication)
    .to(RestApplication);
  container
    .bind<Logger>(Component.Logger)
    .toDynamicValue(() => {
      const nodeEnv = (process.env.NODE_ENV as NodeEnv) || 'development';
      return new PinoLogger(nodeEnv);
    })
    .inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig);

  const application = container.get<RestApplication>(Component.RestApplication);

  await application.init();
}

bootstrap();
