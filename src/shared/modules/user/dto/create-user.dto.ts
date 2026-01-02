import { UserType } from '../../../types/index.js';

import { IsEmail, IsOptional, IsEnum, IsString, Length } from 'class-validator';

import { UserValidationMessage } from './user-validation.messages.js';

export class CreateUserDTO {
  @IsString({ message: UserValidationMessage.name.invalidFormat })
  @Length(1, 15, { message: UserValidationMessage.name.length })
  public name!: string;

  @IsEmail({ message: UserValidationMessage.email.invalidFormat })
  public email!: string;

  @IsOptional()
  public avatar!: string;

  @IsString({ message: UserValidationMessage.password.invalidFormat })
  @Length(6, 12, { message: UserValidationMessage.password.length })
  public password!: string;

  @IsEnum(UserType, {
    message: UserValidationMessage.userType.invalid,
  })
  public userType!: UserType;

  public favorites!: Array<string>;
}
