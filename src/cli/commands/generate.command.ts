import axios from 'axios';

import { generateErrorMessage } from '../../shared/helpers/index.js';
import { OfferGenerator } from '../../shared/libs/OfferGenerator/index.js';
import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import { TSVFileWriter } from '../../shared/libs/TSVFileWriter/index.js';
import { configRestSchema } from '../../shared/libs/config/index.js';

export class GenerateCommand implements Command {
  private rawData = {} as MockServerData;
  private static readonly MOCK_API_URL = `http://${configRestSchema.get(
    'HOST'
  )}:${configRestSchema.get('MOCK_API_PORT')}/api`;

  public getName() {
    return '--generate';
  }

  private async getData(APIURL: string) {
    try {
      const response = await axios.get(APIURL || GenerateCommand.MOCK_API_URL);
      console.log('Raw data fetched:', response.data);

      this.rawData = response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  private async write(offerAmount: number, outputPath: string) {
    const offerGenerator = new OfferGenerator(this.rawData);
    const offerArr = [];
    for (let i = 0; i < offerAmount; i++) {
      const offer = offerGenerator.generate();
      offerArr.push(offer);
    }

    const fileWriter = new TSVFileWriter(outputPath);
    fileWriter.write(offerArr);
  }

  public async execute(...args: string[]): Promise<void> {
    try {
      if (args.length === 0) {
        throw new Error('No args are provided');
      }

      const [amount, outputPath, url] = args;
      const offerAmount = Number.parseInt(amount, 10);
      console.log('HELLO 1');
      await this.getData(url);
      console.log('HELLO 2');
      await this.write(offerAmount, outputPath);
      console.info(`File ${outputPath} was created!`);
    } catch (error: unknown) {
      generateErrorMessage(error, 'Failed to generate mock TSV file');
    }
  }
}
