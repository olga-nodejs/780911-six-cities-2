import 'reflect-metadata';
import { Container } from 'inversify';
import dotenv from 'dotenv';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { RestApplication } from './index.js';
import { RestConfig, RestSchema, Config } from '../shared/libs/config/index.js';
import { NodeEnv, Component } from '../shared/types/index.js';
import { DBClient } from '../shared/libs/db-client/db-client.interface.js';
import { MongoDbClient } from '../shared/libs/db-client/mongo.db-client.js';
import {
  ExceptionFilter,
  AppExceptionFilter,
  ValidationExceptionFilter,
} from '../shared/libs/rest/index.js';
import { HttpErrorExceptionFilter } from '../shared/libs/rest/exception-filter/http.exception-filter.js';
import {
  PathTransformer,
  PathTransformerInterface,
} from '../shared/libs/rest/transform/index.js';

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

  restApplicationContainer
    .bind<ExceptionFilter>(Component.ExceptionFilter)
    .to(AppExceptionFilter)
    .inSingletonScope();

  restApplicationContainer
    .bind<ExceptionFilter>(Component.HttpErrorExceptionFilter)
    .to(HttpErrorExceptionFilter)
    .inSingletonScope();

  restApplicationContainer
    .bind<ExceptionFilter>(Component.ValidationExceptionFilter)
    .to(ValidationExceptionFilter)
    .inSingletonScope();

  restApplicationContainer
    .bind<PathTransformerInterface>(Component.PathTransformer)
    .to(PathTransformer)
    .inSingletonScope();

  return restApplicationContainer;
};
