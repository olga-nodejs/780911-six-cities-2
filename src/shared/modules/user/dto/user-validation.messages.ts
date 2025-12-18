import { UserType } from '../../../types/index.js';

export const UserValidationMessage = {
  name: {
    minLength: 'Minimum name length must be 1',
    maxLength: 'Maximum name length must be 15',
    invalidFormat: 'Name must be string type',
  },
  email: {
    invalidFormat: 'Invalid email address',
  },
  password: {
    minLength: 'Minimum password length must be 6',
    maxLength: 'Maximum password length must be 12',
    invalidFormat: 'password must be string type',
  },
  userType: {
    invalid: `User type must one of next values ${Object.values(UserType).join(
      ', '
    )}`,
  },
} as const;
