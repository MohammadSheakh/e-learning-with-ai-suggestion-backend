import { Model, Types } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';
import { TQuestion } from './question.constant';


export interface IQuestion {
  // _taskId: undefined | Types.ObjectId;
  _id?: Types.ObjectId; // undefined |  Types.ObjectId |
  
  questionText: string;
  type: TQuestion;
  options?: string[];
  correctAnswer?: string;
  capsuleId: Types.ObjectId;

  isDeleted? : boolean;  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuestionModel extends Model<IQuestion> {
  paginate: (
    query: Record<string, any>,
    options: PaginateOptions
  ) => Promise<PaginateResult<IQuestion>>;
}