import { GenerateOffer as GenerateOfferInterface } from './GenerateOffer.interface.js';

export class GenerateOffer implements GenerateOfferInterface {
  constructor(private readonly mockData: string) {}

  generate(): void {
    console.log('hello', this.mockData);
  }
}
