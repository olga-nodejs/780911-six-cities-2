import {
  MaxLength,
  MinLength,
  IsDateString,
  Min,
  Max,
  IsNumber,
  IsMongoId,
  IsString,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CommentValidationMessage } from './comment-validation.messages.js';

export class CreateCommentDTO {
  @IsString({ message: CommentValidationMessage.text.invalidFormat })
  @MinLength(5, { message: CommentValidationMessage.text.minLength })
  @MaxLength(1024, { message: CommentValidationMessage.text.maxLength })
  public text!: string;

  @Type(() => Number)
  @IsInt({ message: CommentValidationMessage.rating.invalidFormat })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 1 },
    { message: CommentValidationMessage.rating.invalidFormat }
  )
  @Min(1, { message: CommentValidationMessage.rating.minValue })
  @Max(5, { message: CommentValidationMessage.rating.maxValue })
  public rating!: number;

  @IsDateString(
    {},
    { message: CommentValidationMessage.publicationDate.invalidFormat }
  )
  public publicationDate!: Date;

  @IsMongoId({ message: CommentValidationMessage.userId.invalidId })
  public userId!: string;

  @IsMongoId({ message: CommentValidationMessage.offerId.invalidId })
  public offerId!: string;
}
