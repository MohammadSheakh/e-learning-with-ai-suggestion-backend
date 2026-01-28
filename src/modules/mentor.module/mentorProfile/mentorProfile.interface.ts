import { Model, Types } from 'mongoose';
import { PaginateOptions, PaginateResult } from '../../../types/paginate';
import { TMentorClass } from './mentorProfile.constant';


export interface IMentorProfile {
  // _taskId: undefined | Types.ObjectId;
  _id?: Types.ObjectId; // undefined |  Types.ObjectId |
  
  attachments?: Types.ObjectId[];
  title: string;
  topics: string[];
  userId: Types.ObjectId;
  mentorCategoryId: Types.ObjectId;
  language: string[];
  classType: TMentorClass; //
  bio: string;
  sessionPrice: number;
  currentJobTitle: string;
  companyName: string;
  yearsOfExperience: number;
  careerStage: string[];
  focusArea: string[];
  industry: string;
  coreValues: string[];
  specialties: string[];
  coachingMethodologies: string[];
  calendlyProfileLink: string;
  profileInfoFillUpCount: number;
  rating: number;

  isDeleted? : boolean;  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMentorProfileModel extends Model<IMentorProfile> {
  paginate: (
    query: Record<string, any>,
    options: PaginateOptions
  ) => Promise<PaginateResult<IMentorProfile>>;
}