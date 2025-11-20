import 'reflect-metadata';
import path from 'node:path';
import {
  pino,
  type Logger as PinoInstance,
  TransportTargetOptions,
} from 'pino';
import { injectable } from 'inversify';

import { Logger } from './Logger.interface.js';
import { getCurrentDirectory } from '../../helpers/common.js';
import { NodeEnv } from '../../types/nodeEnv.js';

@injectable()
export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;
  constructor(nodeEnv: NodeEnv) {
    const transportFile = path.join(
      getCurrentDirectory(import.meta.url),
      '../../../../',
      'logs',
      'app.log'
    );
    const targets: TransportTargetOptions[] = [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:dd-mm-yyyy HH:MM:ss.l',
        },
        level: 'info',
      },
    ];

    if (nodeEnv) {
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

    this.logger.info('Logger created');
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
