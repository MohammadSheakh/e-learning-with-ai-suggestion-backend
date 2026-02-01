import { Model, Types } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';


export interface IAssessment {
  // _taskId: undefined | Types.ObjectId;
  _id?: Types.ObjectId; // undefined |  Types.ObjectId |
  
  userId: Types.ObjectId;
  is_completed: boolean;
  current_phaseId: Types.ObjectId;
  current_questionId: Types.ObjectId;
  
  currentPhaseNumber: number;
  currentQuestionNumber: number;

  isDeleted? : boolean;  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAssessmentModel extends Model<IAssessment> {
  paginate: (
    query: Record<string, any>,
    options: PaginateOptions
  ) => Promise<PaginateResult<IAssessment>>;
}