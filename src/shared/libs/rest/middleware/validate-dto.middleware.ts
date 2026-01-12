import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Middleware } from './middleware.interface.js';
import { ValidationError } from '../errors/validation.error.js';
import { reduceValidationErrors } from '../../../helpers/common.js';

export class ValidateDTOMiddleware implements Middleware {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute(
    { body, path }: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance);
    const res2 = reduceValidationErrors(errors);

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: ${path}`, res2);
    }

    next();
  }
}
