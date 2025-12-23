import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';

export class ForbiddenFieldsMiddleware implements Middleware {
  constructor(private forbiddenFields: string[]) {}

  public execute(req: Request, res: Response, next: NextFunction): void {
    const presentForbiddenFields = this.forbiddenFields.filter(
      (field) => req.body[field] !== undefined
    );

    if (presentForbiddenFields.length > 0) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: `The following fields cannot be updated: ${presentForbiddenFields.join(
          ', '
        )}`,
      });
    }

    next();
  }
}
