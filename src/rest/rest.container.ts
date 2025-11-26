import 'reflect-metadata';
import { Container } from 'inversify';
import dotenv from 'dotenv';
import { Logger, PinoLogger } from '../shared/libs/Logger/index.js';
import { RestApplication } from './index.js';
import { Component } from '../shared/types/index.js';
import { Config } from '../shared/libs/config/config.interface.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { RestConfig } from '../shared/libs/config/rest.config.js';
import { NodeEnv } from '../shared/types/index.js';
import { DBClient } from '../shared/libs/db-client/db-client.interface.js';
import { MongoDbClient } from '../shared/libs/db-client/mongo.db-client.js';

dotenv.config();

export const createRestApplicationContainer = () => {
  const restApplicationContainer = new Container();
  restApplicationContainer
    .bind<RestApplication>(Component.RestApplication)
    .to(RestApplication);
  restApplicationContainer
    .bind<Logger>(Component.Logger)
    .toDynamicValue(() => {
      const nodeEnv = (process.env.NODE_ENV as NodeEnv) || 'development';
      return new PinoLogger(nodeEnv);
    })
    .inSingletonScope();
  restApplicationContainer
    .bind<Config<RestSchema>>(Component.Config)
    .to(RestConfig);
  restApplicationContainer
    .bind<DBClient>(Component.DBClient)
    .to(MongoDbClient)
    .inSingletonScope();

  return restApplicationContainer;
};
