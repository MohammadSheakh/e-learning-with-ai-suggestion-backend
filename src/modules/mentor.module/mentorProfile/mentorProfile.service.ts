import { StatusCodes } from 'http-status-codes';
import { MentorProfile } from './mentorProfile.model';
import { IMentorProfile } from './mentorProfile.interface';
import { GenericService } from '../../_generic-module/generic.services';
import { THaveAdminApproval } from './mentorProfile.constant';
import ApiError from '../../../errors/ApiError';
import { IUser } from '../../user.module/user/user.interface';
import { User } from '../../user.module/user/user.model';


export class MentorProfileService extends GenericService<
  typeof MentorProfile,
  IMentorProfile
> {
  constructor() {
    super(MentorProfile);
  }

  // 💎✨🔍 -> V2 Found
  async updateMentorProfile (data : IMentorProfile & IUser, mentorId: string) {
    
    const existingMentorProfile: IMentorProfile = await MentorProfile.findOne({
      userId : mentorId,
    })

    if(data.name){
      const updatedUser : IUser = await User.findByIdAndUpdate(mentorId,{
        name : data.name
      });
    }

    if(
      data.location ||
      data.classType ||
      data.sessionPrice || 
      data.currentJobTitle || 
      data.companyName ||
      data.yearsOfExperience || 
      data.bio){
        
        // update mentor profile
        if(1 >= existingMentorProfile.profileInfoFillUpCount){
          data.profileInfoFillUpCount = 1;
        }

        await MentorProfile.findByIdAndUpdate(existingMentorProfile._id,{
          location : data.location,
          classType : data.classType,
          sessionPrice: data.sessionPrice, 
          currentJobTitle: data.currentJobTitle,  
          companyName: data.companyName ,
          yearsOfExperience: data.yearsOfExperience ,
          bio: data.bio,

          profileInfoFillUpCount : data.profileInfoFillUpCount || existingMentorProfile.profileInfoFillUpCount,
        })
    }

    //--------------- 2nd Stage

    if(data.careerStage || 
      data.focusArea || 
      data.industry ){

        console.log("2nd stage hit");
        
        // update mentor profile
        if(2 >= existingMentorProfile.profileInfoFillUpCount){
          data.profileInfoFillUpCount = 2;
        }

        await MentorProfile.findByIdAndUpdate(existingMentorProfile._id,{
          industry: data.industry, 
          focusArea: data.focusArea,  
          careerStage: data.careerStage, 

          profileInfoFillUpCount : data.profileInfoFillUpCount || existingMentorProfile.profileInfoFillUpCount,
        })
    }

    // ---------------- 3rd stage

    if(data.coreValues || 
      data.specialties ){

        console.log("3rd stage hit");
        
        // update mentor profile
        if(3 >= existingMentorProfile.profileInfoFillUpCount){
          data.profileInfoFillUpCount = 3;
        }

        await MentorProfile.findByIdAndUpdate(existingMentorProfile._id,{
          specialties: data.specialties, 
          coreValues: data.coreValues,

          profileInfoFillUpCount : data.profileInfoFillUpCount || existingMentorProfile.profileInfoFillUpCount,
        })
    }

    // ---------------- 4th stage

    if(data.coachingMethodologies){

        console.log("4th stage hit");
        
        // update mentor profile
        if(4 >= existingMentorProfile.profileInfoFillUpCount){
          data.profileInfoFillUpCount = 4;
        }

        await MentorProfile.findByIdAndUpdate(existingMentorProfile._id,{
          coachingMethodologies: data.coachingMethodologies,

          profileInfoFillUpCount : data.profileInfoFillUpCount || existingMentorProfile.profileInfoFillUpCount,
        })
    }


  } 

  async updateMentorProfileV2(data: IMentorProfile & IUser, mentorId: string) {

    const existing = await MentorProfile.findOne({ userId: mentorId });
    if (!existing) throw new Error('Mentor profile not found');

    const updateData: any = {};

    /* -----------------------------
      Update user name separately
    ------------------------------ */
    if (data.name) {
      await User.findByIdAndUpdate(mentorId, { name: data.name });
    }

    let newStage = existing.profileInfoFillUpCount || 0;

    /* -----------------------------
      Stage 1
    ------------------------------ */
    if (
      data.location ||
      data.classType ||
      data.sessionPrice ||
      data.currentJobTitle ||
      data.companyName ||
      data.yearsOfExperience ||
      data.bio
    ) {
      Object.assign(updateData, {
        location: data.location,
        classType: data.classType,
        sessionPrice: data.sessionPrice,
        currentJobTitle: data.currentJobTitle,
        companyName: data.companyName,
        yearsOfExperience: data.yearsOfExperience,
        bio: data.bio,
      });

      newStage = Math.max(newStage, 1);
    }

    /* -----------------------------
      Stage 2
    ------------------------------ */
    if (data.careerStage || data.focusArea || data.industry) {
      Object.assign(updateData, {
        industry: data.industry,
        focusArea: data.focusArea,
        careerStage: data.careerStage,
      });

      newStage = Math.max(newStage, 2);
    }

    /* -----------------------------
      Stage 3
    ------------------------------ */
    if (data.coreValues || data.specialties) {
      Object.assign(updateData, {
        specialties: data.specialties,
        coreValues: data.coreValues,
      });

      newStage = Math.max(newStage, 3);
    }

    /* -----------------------------
      Stage 4
    ------------------------------ */
    if (data.coachingMethodologies) {
      updateData.coachingMethodologies = data.coachingMethodologies;
      newStage = Math.max(newStage, 4);
    }

    /* -----------------------------
      Final Atomic Update
    ------------------------------ */
    await MentorProfile.findByIdAndUpdate(
      existing._id,
      {
        $set: updateData,
        $max: { profileInfoFillUpCount: newStage }, // 🔥 atomic safe
      }
    );

    return { message: 'Profile updated successfully' };
  }

  
  /*-─────────────────────────────────
  |  Mentor | request-for-admin-approval
  └──────────────────────────────────*/
  async changeStatusOfHaveAdminApproval(mentorId : string){
    const mentorProfileUpdate : IMentorProfile = MentorProfile.updateOne(
      {
        userId : mentorId,
      },{
        haveAdminApproval : THaveAdminApproval.inRequest,
        requestDate : new Date(),
      },{
        new : true
      }
    )

    if(!mentorProfileUpdate){
      throw new ApiError(StatusCodes.NOT_FOUND, 'Mentor Profile Can not be updated.');
    }

    return mentorProfileUpdate;
  }

  /*-─────────────────────────────────
  |  Mentor | check status of mentor profiles haveAdminApproval
  └──────────────────────────────────*/
  async checkStatusOfHaveAdminApproval(mentorId : string){
    const statusOfMentorProfile : IMentorProfile = MentorProfile.findOne(
      {
        userId : mentorId,
      }
    ).select('haveAdminApproval isLive');

    if(!statusOfMentorProfile){
      throw new ApiError(StatusCodes.NOT_FOUND, 'Mentor Profile Can not be updated.');
    }

    return statusOfMentorProfile;
  }

}
