import axios from 'axios';

import { generateErrorMessage } from '../../helpers/index.js';
import { OfferGenerator } from '../../lib/OfferGenerator/index.js';
import { Command } from './command.interface.js';
import { MockServerData } from '../../types/mockServerData.js';
import { TSVFileWriter } from '../../lib/TSVFileWriter/index.js';

export class GenerateCommand implements Command {
  private rawData = {} as MockServerData;
  private static readonly MOCK_API_URL = 'http://localhost:4000/api';

  public getName() {
    return '--generate';
  }

  private async getData(APIURL: string) {
    try {
      const response = await axios.get(APIURL || GenerateCommand.MOCK_API_URL);

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

      await this.getData(url);
      await this.write(offerAmount, outputPath);
      console.info(`File ${outputPath} was created!`);
    } catch (error: unknown) {
      generateErrorMessage(error, 'Failed to generate mock TSV file');
    }
  }
}
