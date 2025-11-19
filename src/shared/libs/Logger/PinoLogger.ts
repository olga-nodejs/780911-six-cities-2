import path from 'node:path';
import {
  pino,
  type Logger as PinoInstance,
  TransportTargetOptions,
} from 'pino';
import { Logger } from './Logger.interface.js';
import { getCurrentDirectory } from '../../helpers/common.js';

export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;
  constructor() {
    const transportFile = path.join(
      getCurrentDirectory(import.meta.url),
      '../../../',
      'logs',
      'app.log'
    );
    const targets: TransportTargetOptions[] = [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:dd-mm-yyyy hh:mm:ss TT',
        },
        level: 'info',
      },
    ];

    if (process.env.NODE_ENV === 'production') {
      targets.push({
        target: 'pino/file',
        options: { destination: transportFile },
        level: 'debug',
      });
    }

    this.logger = pino({
      transport: {
        targets,
      },
    });
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error(message, error, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }
}
