export const JWT_ALGORITHM = 'HS256';
export const JWT_EXPIRED = '2d';

export enum AuthErrorMessage {
  notFound = 'User not found',
  incorrectCredentials = 'Incorrect user name or password',
}
