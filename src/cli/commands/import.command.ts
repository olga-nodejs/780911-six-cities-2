import path from 'node:path';
import chalk from 'chalk';

import { Command } from './command.interface.js';
import { TSVFileReader } from '../../lib/TSVFileReader/index.js';
import { generateErrorMessage } from '../../helpers/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...args: string[]) {
    try {
      if (args.length === 0) {
        throw new Error('No path for TSV file is provided');
      }

      const [fileArg] = args;
      const filePath = path.resolve(fileArg);

      const reader = new TSVFileReader(filePath);
      reader.read();
      const offers = reader.toOffersArray();
      offers.forEach((offer) => console.log(offer));
    } catch (error: unknown) {
      generateErrorMessage(error, 'Failed to import file');
      console.error(chalk.red('Failed to import file'));
    }
  }
}
