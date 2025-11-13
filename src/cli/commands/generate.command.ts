import axios from 'axios';

import { generateErrorMessage } from '../../helpers/generateErrorMessage.js';
import { Command } from './command.interface.js';

export class GenerateCommand implements Command {
  private rawData: string = '';
  private static readonly MOCK_API_URL = 'http://localhost:4000/api';

  public getName() {
    return '--generate';
  }

  private async getData(APIURL: string) {
    try {
      const response = await axios.get(APIURL || GenerateCommand.MOCK_API_URL);
      console.log(response.data);
      this.rawData = response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }

  public async execute(...args: string[]): Promise<void> {
    try {
      console.log('generate called', { args });
      if (args.length === 0) {
        throw new Error('No args are provided');
      }

      const [amount, outputPath, url] = args;
      const offerAmount = Number.parseInt(amount, 10);

      await this.getData(url);
      console.log({ rawData: this.rawData });
      console.log({ offerAmount, outputPath, url });
    } catch (error: unknown) {
      generateErrorMessage(error, 'Failed to generate mock TSV file');
    }
  }
}

//TODO:  generate from the mock api data a offer
//TODO: generate n offers
// pass args to generate offers

//TODO: update import command call to work with big files
