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

}
