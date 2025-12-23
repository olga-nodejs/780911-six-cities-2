import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.js';

export class TransformFilesToBodyMiddleware implements Middleware {
  private fileFields: string[];
  private singleFields: string[];

  constructor(singleFields: string[] = [], fileArrayFields: string[] = []) {
    this.singleFields = singleFields;
    this.fileFields = fileArrayFields;
  }

  public execute(req: Request, _res: Response, next: NextFunction): void {
    const files = req.files as Record<string, Express.Multer.File[]>;

    this.singleFields.forEach((field) => {
      if (files?.[field]?.length) {
        req.body[field] = files[field][0].filename;
      }
    });

    this.fileFields.forEach((field) => {
      if (files?.[field]?.length) {
        req.body[field] = files[field].map((f) => f.filename);
      }
    });

    next();
  }
}
