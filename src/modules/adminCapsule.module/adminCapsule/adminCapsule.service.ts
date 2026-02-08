//@ts-ignore
import { StatusCodes } from 'http-status-codes';
import { AdminCapsule } from './adminCapsule.model';
import { IAdminCapsule, ICreateAdminCapsuleWithTopics } from './adminCapsule.interface';
import { GenericService } from '../../_generic-module/generic.services';
//@ts-ignore
import mongoose from 'mongoose';
import { logger } from '../../../shared/logger';
import { IAdminCapsuleTopic } from '../adminCapsuleTopic/adminCapsuleTopic.interface';
import { AdminCapsuleTopic } from '../adminCapsuleTopic/adminCapsuleTopic.model';
import { TAdminCapsuleLevel } from './adminCapsule.constant';
import { PaginateOptions } from '../../../types/paginate';
import { AdminModules } from '../adminModules/adminModules.model';
import PaginationService from '../../../common/service/paginationService';
import ApiError from '../../../errors/ApiError';

export class AdminCapsuleService extends GenericService<
  typeof AdminCapsule,
  IAdminCapsule
> {
  constructor() {
    super(AdminCapsule);
  }

  async createV2(data:/*InterfaceType*/ Partial<ICreateAdminCapsuleWithTopics>, adminId :string) : Promise<any> {
    // console.log('req.body from generic create 🧪🧪', data);

    const session = await mongoose.startSession();
    session.startTransaction();
    let createdAdminCapsule: IAdminCapsule;

    try{
      // here we need to create capsule first .. 
      // then need to create capsules topic
      
      const adminCapsuleDTO : IAdminCapsule = {
        title : data.title as string,
        level : data.level as TAdminCapsuleLevel,
        description : data.description as string,
        totalModule : data.totalModule as number,
        price : data.price as number,
        attachments : data.attachments, // come from middleware  --- need to test 
        introductionVideo : data.introductionVideo, // come from middleware  
        adminId : adminId,
        capsuleCategoryId : data.capsuleCategoryId,
      }

      // createdAdminCapsule = await this.model.create(adminCapsuleDTO)


      createdAdminCapsule = await this.createWithSession(adminCapsuleDTO, session);


      if(data.whatYouLearn?.length > 0){
        // bulk insert for performance
        const topics: IAdminCapsuleTopic[] = data.whatYouLearn?.map((topic : string, idx) => ({
          adminCapsuleId : createdAdminCapsule._id,
          title : topic,
        }))

        const res = await AdminCapsuleTopic.insertMany(topics, { session });
      }
      
      await session.commitTransaction();

      return createdAdminCapsule;
      
    }catch(error){
      await session.abortTransaction();
      logger.error('Failed to create adminCapsule:', error);
      throw error;
    }finally{
      session.endSession();
    }

  }

  async getAllModulesByCapsuleId(
    options: PaginateOptions,
    capsuleId : string)
  {
    const capsule = await AdminCapsule.findOne(
      { _id: capsuleId, isDeleted: false },
      {
        title: 1,
        subTitle: 1,
        description: 1,
        price: 1,
        level: 1,
        estimatedTime: 1,
        totalModule: 1,
        attachments: 1,
        introductionVideo: 1,
      }
    )
    .populate([
      { path: 'attachments', select: 'attachment' },
      { path: 'introductionVideo', select: 'attachment' },
    ])
    .lean();

    if (!capsule) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Capsule not found');
    }

    capsule.attachments = capsule.attachments.map((a: any) => a.attachment);
    capsule.introductionVideo = capsule.introductionVideo.map(
      (v: any) => v.attachment
    );


    const topics = await AdminCapsuleTopic.find(
      { adminCapsuleId: capsuleId, isDeleted: false },
      { title: 1 }
    )
    .sort({ createdAt: 1 })
    .lean();


    const modulePipeline = [
      {
        $match: {
          capsuleId: new mongoose.Types.ObjectId(capsuleId),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: 'attachments',
          localField: 'attachments',
          foreignField: '_id',
          as: 'attachments',
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          estimatedTime: 1,
          numberOfLessons: 1,
          attachments: {
            $map: {
              input: '$attachments',
              as: 'att',
              in: '$$att.attachment',
            },
          },
        },
      },
    ];

    const modules = await PaginationService.aggregationPaginate(
      AdminModules,
      modulePipeline,
      options // page, limit, sort
    );

    return {
      capsule,
      topics,
      modules, // paginated result
    };
    
  }

}
