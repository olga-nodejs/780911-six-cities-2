import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.js';

export class LoggerMiddleware implements Middleware {
  public execute(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    // Log incoming request
    console.log('--- LoggerMiddleware 1 ---');
    console.log({
      method: req.method,
      url: req.originalUrl,
      params: req.params,
      query: req.query,
      body: req.body,
      headers: req.headers,
    });

    // Log response when finished
    res.on('finish', () => {
      const duration = Date.now() - start;

      console.log('--- LoggerMiddleware 2 ---');
      console.log({
        statusCode: res.statusCode,
        statusMessage: res.statusMessage,
        durationMs: duration,
      });
    });

    next();
  }
}
