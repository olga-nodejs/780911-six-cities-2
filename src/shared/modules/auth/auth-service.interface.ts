import { LoginUserDTO, UserEntity } from '../user/index.js';

export interface AuthService {
  issueToken(user: UserEntity): Promise<string>;
  authenticate(dto: LoginUserDTO): Promise<UserEntity>;
}
