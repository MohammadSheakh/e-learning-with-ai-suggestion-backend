//@ts-ignore
import { Model, Types } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';
import { TAdminCapsuleLevel } from './adminCapsule.constant';


export interface IAdminCapsule {
  // _taskId: undefined | Types.ObjectId;
  _id?: Types.ObjectId; // undefined |  Types.ObjectId |
  

  capsuleNumber: number;
  title: string;
  subTitle: string;
  description: string;
  introductionVideo?: Types.ObjectId[]; //🔗🖼️
  attachments?: Types.ObjectId[]; //🔗🖼️
  capsuleCategoryId: Types.ObjectId; //🔗
  topics: string[];
  estimatedTime: number;
  totalModule: number;
  level: TAdminCapsuleLevel; //🧩
  adminId: Types.ObjectId; //🔗

  isDeleted? : boolean;  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAdminCapsuleModel extends Model<IAdminCapsule> {
  paginate: (
    query: Record<string, any>,
    options: PaginateOptions
  ) => Promise<PaginateResult<IAdminCapsule>>;
}