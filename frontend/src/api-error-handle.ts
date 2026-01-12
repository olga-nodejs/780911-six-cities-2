import { AxiosError } from 'axios';
import { ApiErrorResponse, ValidationErrorDetail } from './types/types';

// TODO: remove logs
export const apiErrorHandle = (error: AxiosError) => {
  if (!error.response) {
    return 'Network error. Please check your connection.';
  }

  const data = error.response.data as ApiErrorResponse;
  if (!('errorType' in data)) {
    return data.message;
  }

  switch (data.errorType) {
    case 'VALIDATION_ERROR':
      if (Array.isArray(data.details)) {
        return data.details
          .map((detail: ValidationErrorDetail) => detail.messages.join(', '))
          .join('\n');
      }
      return data.message;

    case 'SERVICE_ERROR':
      return data.error || data.message;

    case 'AUTHORIZATION':
      return data.error;
    case 'NOT_FOUND':
    case 'UNAUTHORIZED':
      return data.message;

    default:
      return `Request failed with status ${error.response.status}`;
  }
};
