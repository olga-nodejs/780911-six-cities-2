import { createWriteStream, WriteStream } from 'node:fs';
import { FileWriter } from './FileWriter.interface.js';
import { isNumber } from '../../helpers/common.js';

/**
 * Class responsible for writing an array of objects to a TSV (tab-separated values) file.
 * Supports nested objects and arrays up to one level deep.
 * Arrays are joined with commas, objects are flattened into their values.
 * @implements {FileWriter}
 */

export class TSVFileWriter implements FileWriter {
  private stream: WriteStream;

  constructor(filename: string) {
    this.stream = createWriteStream(filename, {
      flags: 'w',
      encoding: 'utf-8',
      autoClose: true,
    });
  }

  write(data: Array<object>) {
    this.stream.on('error', (err) => {
      console.error('Error writing file:', err);
    });

    console.log({ data });
    data.forEach((item) => {
      const values = Object.values(item);
      const row = values
        .map((value) => {
          console.log({ value });
          if (Array.isArray(value)) {
            return value.join();
          }

          if (value instanceof Date) {
            return value.toISOString();
          }

          if (
            typeof value === 'object' &&
            !Array.isArray(value) &&
            value !== null
          ) {
            return Object.values(value).join();
          }

          if (isNumber(value) || typeof value === 'boolean') {
            return value.toString();
          }
          console.log({ value });
          return value;
        })
        .join('\t');
      this.stream.write(`${row}\n`);
      console.log({ row });
    });

    this.stream.end(() => {
      console.log('File has been written successfully.');
    });
  }
}
