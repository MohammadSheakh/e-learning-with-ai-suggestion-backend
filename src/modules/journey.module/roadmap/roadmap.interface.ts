import { Model, Types } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';
import { TRoadmap } from './roadmap.constant';


export interface IRoadmap {
  // _taskId: undefined | Types.ObjectId;
  _id?: Types.ObjectId; // undefined |  Types.ObjectId |
  
  title: string;
  description: string;
  type: TRoadmap; //🧩
  capsuleId: Types.ObjectId; //🔗

  isDeleted? : boolean;  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRoadmapModel extends Model<IRoadmap> {
  paginate: (
    query: Record<string, any>,
    options: PaginateOptions
  ) => Promise<PaginateResult<IRoadmap>>;
}