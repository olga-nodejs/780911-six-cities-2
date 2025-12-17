import { NextFunction, Request, Response } from 'express';
import { HttpMethod, Middleware } from '../index.js';

export interface Route {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: Middleware[];
}
