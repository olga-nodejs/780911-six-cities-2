import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ExceptionFilter } from './exception-filter.interface.js';
import { Logger } from '../../logger/index.js';
import { Component } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';
import { createErrorObject } from '../../../helpers/common.js';
import { ApplicationError } from '../types/index.js';

@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[HttpErrorException]: ${error.message}`, error);

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}
