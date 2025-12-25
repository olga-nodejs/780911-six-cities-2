import { UserType } from '../../../types/index.js';

export const UserValidationMessage = {
  name: {
    length: 'Name must contain a minimum of 1 and a maximum of 15 characters',
    invalidFormat: 'Name must be string type',
  },
  email: {
    invalidFormat: 'Invalid email address',
  },
  password: {
    length:
      'Password must contain a minimum of 6 and a maximum of 12 characters',
    invalidFormat: 'password must be string type',
  },
  userType: {
    invalid: `User type must one of next values ${Object.values(UserType).join(
      ', '
    )}`,
  },
} as const;
