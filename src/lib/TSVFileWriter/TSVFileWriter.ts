import { createWriteStream, WriteStream } from 'node:fs';
import { FileWriter } from './FileWriter.interface.js';
import { valueToTSVString } from '../../helpers/common.js';

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

    data.forEach((item) => {
      const values = Object.values(item);
      const row = values.map((value) => valueToTSVString(value)).join('\t');
      this.stream.write(`${row}\n`);
    });

    this.stream.end(() => {
      console.log('File has been written successfully.');
    });
  }
}
