import { Length, IsEmail, IsString } from 'class-validator';

import { UserValidationMessage } from './user-validation.messages.js';

export class LoginUserDto {
  @IsEmail({ message: UserValidationMessage.email.invalidFormat })
  public email!: string;

  @IsString({ message: UserValidationMessage.password.invalidFormat })
  @Length(6, 12, { message: UserValidationMessage.password.length })
  public password!: string;
}
