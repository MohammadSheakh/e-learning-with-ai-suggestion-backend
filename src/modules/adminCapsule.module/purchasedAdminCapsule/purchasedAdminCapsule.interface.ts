import { Model, Types } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';
import { TPurchasedAdminCapsuleStatus } from './purchasedAdminCapsule.constant';


export interface IPurchasedAdminCapsule {
  // _taskId: undefined | Types.ObjectId;
  _id?: Types.ObjectId; // undefined |  Types.ObjectId |
  
  capsuleId: Types.ObjectId; //🔗
  studentId: Types.ObjectId; //🔗
  status: TPurchasedAdminCapsuleStatus;  //🧩
  isGifted: boolean;
  uploadedCertificate?: Types.ObjectId[]; //🔗🖼️
  isCertificateUploaded: boolean;
  completedModules: number;
  totalModules: number;
  progressPercent: number;

  isDeleted? : boolean;  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPurchasedAdminCapsuleModel extends Model<IPurchasedAdminCapsule> {
  paginate: (
    query: Record<string, any>,
    options: PaginateOptions
  ) => Promise<PaginateResult<IPurchasedAdminCapsule>>;
}