import { Container } from 'inversify';
import { AuthService } from './auth-service.interface.js';
import { Component } from '../../types/component.enum.js';
import { DefaultAuthService, AuthExceptionFilter } from './index.js';

export function createAuthContainer() {
  const authContainer = new Container();

  authContainer
    .bind<AuthService>(Component.AuthService)
    .to(DefaultAuthService)
    .inSingletonScope();

  authContainer
    .bind<AuthExceptionFilter>(Component.AuthExceptionFilter)
    .to(AuthExceptionFilter)
    .inSingletonScope();

  return authContainer;
}
