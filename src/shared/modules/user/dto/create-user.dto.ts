import { UserType } from '../../../types/index.js';

import {
  MaxLength,
  MinLength,
  IsEmail,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';

import { UserValidationMessage } from './user-validation.messages.js';

export class CreateUserDTO {
  @IsString({ message: UserValidationMessage.name.invalidFormat })
  @MinLength(1, { message: UserValidationMessage.name.minLength })
  @MaxLength(15, { message: UserValidationMessage.name.maxLength })
  public name!: string;

  @IsEmail({ message: UserValidationMessage.email.invalidFormat })
  public email!: string;

  @IsOptional()
  public image!: string;

  @IsString({ message: UserValidationMessage.password.invalidFormat })
  @MinLength(6, { message: UserValidationMessage.password.minLength })
  @MaxLength(12, { message: UserValidationMessage.password.maxLength })
  public password!: string;

  @IsEnum(UserType, {
    message: UserValidationMessage.userType.invalid,
  })
  public userType!: UserType;
}

// TODO: image validation
// TODO: Если пользователь не загрузил аватар, сервис возвращает изображение аватарки по умолчанию. Выбор изображения по умолчанию остаётся на усмотрение студента.
