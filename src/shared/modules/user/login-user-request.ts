import { Request } from 'express';
import { RequestBody, RequestParams } from '../../libs/rest/index.js';
import { LoginUserDto } from './dto/login-user.dto.js';

export type LoginUserRequest = Request<
  RequestParams,
  RequestBody,
  LoginUserDto
>;

//TODO: move this file to types folder in user folder
