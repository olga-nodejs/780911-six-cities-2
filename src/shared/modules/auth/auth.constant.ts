export enum JWT_CONFIG {
  AlgorithmHS256 = 'HS256',
  ExpiresIn = '2d',
}

export enum AuthErrorMessage {
  notFound = 'User not found',
  incorrectCredentials = 'Incorrect user name or password',
}
