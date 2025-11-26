export const Component = {
  RestApplication: Symbol.for('RestApplication'),
  Logger: Symbol.for('Logger'),
  Config: Symbol.for('Config'),
  DBClient: Symbol.for('DBClient'),
  UserService: Symbol.for('UserService'),
  UserModel: Symbol.for('UsrModel'),
} as const;
