import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

import { FileReader } from './FileReader.interface.js';

const CHUNK_SIZE = 16384; // 16KB
/**
 * TSVFileReader
 * --------------
 * A streaming TSV (Tab-Separated Values) file reader that emits events for each line.
 *
 * This reader:
 * - Reads the file asynchronously using a Node.js read stream.
 * - Accumulates chunks until full lines (`\n`) are found.
 * - Emits:
 *    - `"line"` — every time a complete TSV row is parsed.
 *    - `"end"` — after the entire file is processed, with total row count.
 *
 * @example
 * const reader = new TSVFileReader('./data/offers.tsv');
 *
 * reader.on('line', (row) => {
 *   console.log('row:', row);
 * });
 *
 * reader.on('end', (count) => {
 *   console.log(`Finished reading ${count} rows`);
 * });
 *
 * await reader.read();
 *
 */

export class TSVFileReader extends EventEmitter implements FileReader {
  constructor(private readonly path: string) {
    super();
  }

  public async read() {
    const readStream = createReadStream(this.path, {
      highWaterMark: CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        this.emit('line', completeRow);
      }
    }

    this.emit('end', importedRowCount);
  }
}
