/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import {
  prop,
  getModelForClass,
  defaultClasses,
  modelOptions,
} from '@typegoose/typegoose';

import { User, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/common.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  },
  options: {
    allowMixed: 0,
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: true })
  public name: string;

  @prop({ required: false, default: '' })
  public image: string;

  @prop({
    type: () => String,
    enum: UserType,
  })
  public userType!: UserType;

  @prop({ required: true, default: '' })
  private password?: string;

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.name = userData.name;
    this.image = userData.image ?? '';
    this.userType = userData.userType ?? 'starter';
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
