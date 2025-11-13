import fs from 'node:fs';

import { FileReader } from './FileReader.interface.js';

export class TSVFileReader implements FileReader {
  private rawData: string = '';

  constructor(private readonly path: string) {}

  public read() {
    if (!this.path) {
      throw new Error('No path for TSV file is provided');
    }

    if (!fs.existsSync(this.path)) {
      throw new Error(`TSV File not found at: ${this.path}`);
      return;
    }
    this.rawData = fs.readFileSync(this.path, 'utf8');
  }

  public toOffersArray() {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
    console.log({ data: this.rawData });
    return this.rawData
      .split('\n')
      .filter((item) => item.length)
      .map((line) => {
        const values = line.split('\t');
        return [
          'title',
          'description',
          'publicationDate',
          'city',
          'previewImage',
          'propertyPhotos',
          'rating',
          'propertyType',
          'roomsNumber',
          'guestsNumber',
          'rentalCost',
          'features',
          'author',
          'coordinates',
          'premium_flag',
        ].reduce((acc, key, i) => {
          acc[key] = values[i];
          return acc;
        }, {} as Record<string, string>);
      });
  }
}
