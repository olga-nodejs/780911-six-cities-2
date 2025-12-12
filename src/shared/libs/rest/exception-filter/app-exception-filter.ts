import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { ExceptionFilter } from './exception-filter.interface.js';
import { Logger } from '../../Logger/index.js';
import { Component } from '../../../types/index.js';
import { Request, Response, NextFunction } from 'express';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register AppExceptionFilter');
  }

  public catch(
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}
