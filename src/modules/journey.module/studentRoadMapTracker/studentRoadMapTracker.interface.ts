import { Model, Types } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';
import { TStudentRoadMapTrackerStatus } from './studentRoadMapTracker.constant';

export interface IStudentRoadMapTracker {
  // _taskId: undefined | Types.ObjectId;
  _id?: Types.ObjectId; // undefined |  Types.ObjectId |
  
  roadMapId: Types.ObjectId; //🔗
  studentId: Types.ObjectId; //🔗
  status: TStudentRoadMapTrackerStatus; //🧩

  isDeleted? : boolean;  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IStudentRoadMapTrackerModel extends Model<IStudentRoadMapTracker> {
  paginate: (
    query: Record<string, any>,
    options: PaginateOptions
  ) => Promise<PaginateResult<IStudentRoadMapTracker>>;
}