import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/http-error.js';

type ImageRule = {
  name: string;
  maxCount: number;
  isRequired: boolean;
};
export class ValidateImagesMiddleware implements Middleware {
  constructor(private rules: readonly ImageRule[]) {}

  execute(req: Request, _res: Response, next: NextFunction) {
    const filesMap = req.files as
      | Record<string, Express.Multer.File[]>
      | undefined;

    const singleFile = req.file;

    for (const rule of this.rules) {
      let uploadedFiles: Express.Multer.File[] | undefined;

      if (rule.name && singleFile && rule.name === singleFile.fieldname) {
        uploadedFiles = [singleFile];
      } else {
        uploadedFiles = filesMap?.[rule.name];
      }

      if (rule.isRequired && (!uploadedFiles || uploadedFiles.length === 0)) {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          `${rule.name} is required`
        );
      }

      if (!uploadedFiles) {
        continue;
      }

      if (uploadedFiles.length !== rule.maxCount) {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          `${rule.name} must contain exactly ${rule.maxCount} images`
        );
      }

      for (const file of uploadedFiles) {
        if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
          throw new HttpError(
            StatusCodes.BAD_REQUEST,
            `${rule.name} must be JPG or PNG`
          );
        }
      }
    }

    next();
  }
}
