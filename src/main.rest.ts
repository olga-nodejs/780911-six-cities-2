import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createRestApplicationContainer } from '../src/rest/index.js';
import { createUserContainer } from './shared/modules/user/user.container.js';
import { createCommentContainer } from './shared/modules/comment/comment.container.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';
import { createAuthContainer } from './shared/modules/auth/index.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createCommentContainer(),
    createOfferContainer(),
    createAuthContainer()
  );
  const application = appContainer.get<RestApplication>(
    Component.RestApplication
  );
  await application.init();
}

bootstrap();
