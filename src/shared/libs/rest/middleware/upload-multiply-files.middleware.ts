import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import * as crypto from 'node:crypto';
import { Middleware } from './middleware.interface.js';

export class UploadMultipleFilesMiddleware implements Middleware {
  constructor(
    private uploadDirectory: string,
    private filesArr: readonly { name: string; maxCount?: number }[] // private fieldName: string, // private maxCount: number
  ) {}

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, cb) => {
        const ext = extension(file.mimetype);
        cb(null, `${crypto.randomUUID()}.${ext}`);
      },
    });

    const upload = multer({ storage }).fields(this.filesArr);
    upload(req, res, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  }
}
