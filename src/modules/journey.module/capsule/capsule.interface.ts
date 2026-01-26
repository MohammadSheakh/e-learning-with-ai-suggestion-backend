import { Model, Types } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';


export interface ICapsule {
  // _taskId: undefined | Types.ObjectId;
  _id?: Types.ObjectId; // undefined |  Types.ObjectId |
  
  capsuleNumber: number;
  title: string;
  subTitle: string;
  description: string; // from rich text editor
  missionBriefing: string;

  introductionVideo?:  Types.ObjectId[] | undefined;//🖼️🧩  // array of video URLs or file paths
  attachments?:  Types.ObjectId[] | undefined;//🖼️🧩  // array of attachment URLs or file paths

  journeyId: Types.ObjectId; // FK to Journey
  totalModule: number; // show value — e.g., total modules in this capsule
  adminId: Types.ObjectId; //🔗 FK to User (admin who created it)


  isDeleted? : boolean;  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICapsuleModel extends Model<ICapsule> {
  paginate: (
    query: Record<string, any>,
    options: PaginateOptions
  ) => Promise<PaginateResult<ICapsule>>;
}