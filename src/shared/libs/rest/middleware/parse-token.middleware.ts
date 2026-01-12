import { createSecretKey } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './index.js';
import { TokenPayload } from '../../../modules/auth/index.js';
import { HttpError } from '../errors/index.js';

function isTokenPayload(payload: unknown): payload is TokenPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'email' in payload &&
    'id' in payload &&
    typeof payload.id === 'string'
  );
}

export class ParseTokenMiddleware implements Middleware {
  constructor(private readonly jwtSecret: string) {}

  public async execute(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    const publicRoutes = ['/login', '/register'];

    if (publicRoutes.includes(req.path)) {
      return next();
    }

    const authorizationHeader = req.headers?.authorization?.split(' ');

    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(
        token,
        createSecretKey(this.jwtSecret, 'utf-8')
      );

      if (isTokenPayload(payload)) {
        req.tokenPayload = { ...payload };
        return next();
      } else {
        throw new Error('Bad token');
      }
    } catch {
      return next(
        new HttpError(
          StatusCodes.UNAUTHORIZED,
          'Invalid token',
          'AuthenticateMiddleware'
        )
      );
    }
  }
}
