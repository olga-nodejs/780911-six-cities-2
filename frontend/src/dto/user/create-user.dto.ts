import { UserType } from './user-type';

export default class CreateUserDto {
  public name!: string;

  public email!: string;

  public avatar?: string;

  public password!: string;

  public userType!: UserType;

  public favorites!: string[];
}
