import path from 'node:path';
import chalk from 'chalk';

import { Command } from './command.interface.js';
import { TSVFileReader } from '../../lib/TSVFileReader/index.js';
import { generateErrorMessage, createOffer } from '../../helpers/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
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

      reader.on('line', this.onImportedLine);
      reader.on('end', this.onCompleteImport);
    } catch (error: unknown) {
      generateErrorMessage(error, 'Failed to import file');
      console.error(chalk.red('Failed to import file'));
    }
  }
}
