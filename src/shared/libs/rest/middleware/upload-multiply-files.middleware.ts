import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import * as crypto from 'node:crypto';
import { Middleware } from './middleware.interface.js';

export class UploadMultipleFilesMiddleware implements Middleware {
  constructor(
    private uploadDirectory: string,
    private filesArr: readonly { name: string; maxCount?: number }[]
  ) {}

  private fileFilter(
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      return cb(null, true);
    } else {
      return cb(new Error('Invalid file type, only PNG and JPG are allowed'));
    }
  }

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

    const upload = multer({
      storage,
      fileFilter: this.fileFilter.bind(this),
    }).fields(this.filesArr);

    upload(req, res, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  }
}
