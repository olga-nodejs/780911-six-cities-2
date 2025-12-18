export const CommentValidationMessage = {
  text: {
    minLength: 'Minimum text length must be 5',
    maxLength: 'Maximum text length must be 1024',
    invalidFormat: 'Text must be string type',
  },
  publicationDate: {
    invalidFormat: 'PostDate must be a valid ISO date',
  },
  rating: {
    invalidFormat: 'Rating must be an integer',
    minValue: 'Minimum rating is 1',
    maxValue: 'Maximum rating is 5',
  },
  userId: {
    invalidId: 'UserId field must be a valid id',
  },
  offerId: {
    invalidId: 'OfferId field must be a valid id',
  },
} as const;
