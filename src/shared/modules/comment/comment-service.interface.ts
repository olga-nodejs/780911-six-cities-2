import { DocumentType } from '@typegoose/typegoose';
import { CreateCommentDTO } from './dto/create-comment.dto.js';
import { CommentEntity } from './comment.entity.js';

export interface CommentService {
  create({
    offerId,
    userId,
    dto,
  }: {
    offerId: string;
    userId: string;
    dto: CreateCommentDTO;
  }): Promise<DocumentType<CommentEntity>>;
  deleteByOfferId(offerId: string): Promise<number>;
}
