import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';

export class ValidateDTOMiddleware implements Middleware {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute(
    { body }: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
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

      return next();
    } catch (error) {
      return next(error);
    }
  }
}
// export class ValidateDTOMiddleware implements Middleware {
//   constructor(private dto: ClassConstructor<object>) {}

//   public async execute(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> {
//     try {
//       // Extract files from request (from UploadMultipleFilesMiddleware)
//       const files = req.files as Record<string, Express.Multer.File[]>;

//       const propertyPhotos = files?.propertyPhotos || [];
//       const previewImage = files?.previewImage?.[0] || null;

//       // Merge body fields and files into DTO instance
//       const dtoInstance = plainToInstance(this.dto, {
//         ...req.body,
//         propertyPhotos,
//         previewImage,
//       });

//       // Validate DTO
//       const errors: ValidationError[] = await validate(dtoInstance);

//       if (errors.length > 0) {
//         const validatedMessage = errors.map((item) => {
//           const { constraints, property } = item;
//           if (!constraints) {
//             return `Failed validation field: ${property}.`;
//           }
//           return {
//             [property]: Object.entries(constraints)
//               .map(([k, v]) => `${k}: ${v}`)
//               .join(', '),
//           };
//         });

//         // Return immediately after sending response
//         res
//           .status(StatusCodes.BAD_REQUEST)
//           .send({ validatedMessage, fullError: errors });
//       }

//       // Validation passed → continue to next middleware
//       return next();
//     } catch (err) {
//       // Forward unexpected errors to Express error handler
//       return next(err);
//     }
//   }
// public async execute(
//   { body }: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {
//   const dtoInstance = plainToInstance(this.dto, body);
//   const errors: Array<ValidationError> = await validate(dtoInstance);

//   const validatedMessage = errors.map((item) => {
//     const { constraints, property } = item;

//     if (!constraints) {
//       return `Failed validation field: ${property}.`;
//     }
//     return {
//       [property]: Object.entries(constraints)
//         .map(([k, v]) => `${k}: ${v}`)
//         .join(', '),
//     };
//   });

//   if (errors.length > 0) {
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .send({ validatedMessage, fullError: errors });
//     return;
//   }

//   next();
// }
// }
