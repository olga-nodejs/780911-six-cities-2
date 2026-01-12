import { inject, injectable } from 'inversify';
import { Component } from '../../../types/index.js';
import { Logger } from '../../Logger/index.js';
import { Config, RestSchema } from '../../config/index.js';
import { getFullServerPath, isPlainObject } from '../../../helpers/common.js';
import {
  DEFAULT_STATIC_IMAGES,
  STATIC_RESOURCE_FIELDS,
} from './path-transformer.constant.js';
import { StaticRoutes } from '../../../../rest/index.js';
import { PathTransformerInterface } from './path-transformer.interface.js';
/**
 * Transforms relative static resource paths into fully-qualified server URLs.
 *
 * This class walks through an arbitrary object structure and rewrites
 * known static resource fields (e.g. images, files) by prefixing them with
 * the server host, port, and appropriate static or upload route.
 *
 * - Supports nested objects and arrays
 * - Handles default static images and uploaded files differently
 * - Mutates the input object in place and returns it
 *
 * @implements {PathTransformerInterface}
 */

@injectable()
export class PathTransformer implements PathTransformerInterface {
  private staticPath = StaticRoutes.StaticFiles;
  private uploadPath = StaticRoutes.Upload;
  private serverHost: string;
  private serverPort: number;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {
    this.logger.info('PathTranformer created!');
    this.serverHost = this.config.get('HOST');
    this.serverPort = this.config.get('PORT');
  }

  private hasDefaultImage(value: string) {
    return DEFAULT_STATIC_IMAGES.includes(value);
  }

  private rootPath(value: string) {
    return this.hasDefaultImage(value) ? this.staticPath : this.uploadPath;
  }

  private isStaticProperty(property: string) {
    return STATIC_RESOURCE_FIELDS.includes(property);
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    const stack = [data];

    while (stack.length > 0) {
      const current = stack.pop();

      for (const key in current) {
        if (Object.hasOwn(current, key)) {
          const value = current[key];

          if (
            this.isStaticProperty(key) &&
            typeof value === 'string' &&
            this.hasDefaultImage(value)
          ) {
            current[key] = `${getFullServerPath(
              this.serverHost,
              this.serverPort
            )}${this.rootPath(value)}/${value}`;
          }

          if (Array.isArray(value)) {
            if (this.isStaticProperty(key)) {
              current[key] = value.map(
                (item) =>
                  `${getFullServerPath(
                    this.serverHost,
                    this.serverPort
                  )}${this.rootPath(item)}/${item}`
              );
            } else {
              for (const item of value) {
                if (isPlainObject(item)) {
                  stack.push(item);
                }
              }
              continue;
            }
          } else if (isPlainObject(value)) {
            stack.push(value);
            continue;
          }
        }
      }
    }
    return data;
  }
}
