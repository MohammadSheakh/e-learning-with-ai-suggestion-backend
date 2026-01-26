import { Model, Types } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';


export interface IPurchasedJourney {
  // _taskId: undefined | Types.ObjectId;
  _id?: Types.ObjectId; // undefined |  Types.ObjectId |
  
  journeyId: Types.ObjectId; //🔗
  studentId: Types.ObjectId; //🔗
  studentsAnswer: string;
  aiSummary: string;

  isDeleted? : boolean;  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPurchasedJourneyModel extends Model<IPurchasedJourney> {
  paginate: (
    query: Record<string, any>,
    options: PaginateOptions
  ) => Promise<PaginateResult<IPurchasedJourney>>;
}