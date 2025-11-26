import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createRestApplicationContainer } from '../src/rest/index.js';
import { createUserContainer } from './shared/modules/user/user.container.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer()
  );
  const application = appContainer.get<RestApplication>(
    Component.RestApplication
  );
  await application.init();
}

bootstrap();
