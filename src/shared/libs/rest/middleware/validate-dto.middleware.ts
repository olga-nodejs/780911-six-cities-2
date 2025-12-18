import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute(
    { body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);
    const errors: Array<ValidationError> = await validate(dtoInstance);

    const validatedMessage = errors.map((item) => {
      const { constraints, property } = item;

      if (!constraints) {
        return `Failed validation field: ${property}.`;
      }
      return {
        [property]: Object.entries(constraints)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', '),
      };
    });

    if (errors.length > 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ validatedMessage, fullError: errors });
      return;
    }

    next();
  }
}
