import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import { ExceptionFilter } from './exception-filter.interface.js';
import { Logger } from '../../logger-temp/index.js';
import { Component } from '../../../types/index.js';
import { HttpError } from '../errors/http-error.js';
import { createErrorObject } from '../../../helpers/common.js';
import { ApplicationError } from '../types/application-error.enum.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register AppExceptionFilter');
  }

  public catch(
    error: Error | HttpError,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ApplicationError.ServiceError, error.message));
  }
}
