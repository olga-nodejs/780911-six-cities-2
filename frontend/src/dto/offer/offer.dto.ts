import { City, PropertyType, PropertyFeature, BaseOfferDTO } from './types';
import { UserType } from '../user/user-type';
export class OfferDto extends BaseOfferDTO {
  user!: {
    _id: string;
    name: string;
    userType: UserType;
  };

  id!: string;
}
