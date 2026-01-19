import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import {
  ApplicationError,
  ExceptionFilter,
  HttpError,
} from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { BaseUserException } from './errors/base-user.exception.js';
import { createErrorObject } from '../../helpers/common.js';

@injectable()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register AuthExceptionFilter');
  }

  public catch(
    error: Error | HttpError,
    _req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (!(error instanceof BaseUserException)) {
      return next(error);
    }

    this.logger.error(`[AuthModule] ${error.message}`, error);
    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ApplicationError.Authorization, error.message));
  }
}
