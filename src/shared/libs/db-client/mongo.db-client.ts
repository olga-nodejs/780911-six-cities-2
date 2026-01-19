import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { setTimeout } from 'node:timers/promises';
import { DBClient } from './db-client.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../logger/index.js';

const RETRY_COUNT = 5;
const RETRY_TIMEOUT = 1000;

@injectable()
export class MongoDbClient implements DBClient {
  private mongoose!: typeof Mongoose;
  private isConnected: boolean = false;

  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.isConnected = false;
  }

  public isConnectedToDB() {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDB()) {
      throw new Error('MongoDB client already connected');
    }

    this.logger.info('Trying to connect to MongoDB…');

    let attempt = 0;
    while (attempt < RETRY_COUNT) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info('Database connection established.');

        return;
      } catch (error) {
        attempt++;
        this.logger.error(
          `Failed to connect to the database. Attempt ${attempt}`,
          error as Error
        );

        await setTimeout(RETRY_TIMEOUT);
      }
    }

    throw new Error(
      `Unable to establish database connection after ${RETRY_COUNT}`
    );
  }

  async disconnect(): Promise<void> {
    try {
      if (!this.isConnectedToDB()) {
        throw Error('already disconnected from MongoDB');
      }
      this.logger.info('Closing connection to MongoDB');
      await this.mongoose.disconnect?.();
      this.isConnected = false;
      this.logger.info('MongoDB connection closed successfully');
    } catch (err) {
      this.logger.error('MongoDB closing connection error:', err as Error);
    }
  }
}
