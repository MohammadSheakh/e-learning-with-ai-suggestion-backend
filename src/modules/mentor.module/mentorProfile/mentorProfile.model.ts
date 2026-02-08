//@ts-ignore
import { model, Schema } from 'mongoose';
import { IMentorProfile, IMentorProfileModel } from './mentorProfile.interface';
import paginate from '../../../common/plugins/paginate';
import { TMentorClass } from './mentorProfile.constant';

const MentorProfileSchema = new Schema<IMentorProfile>(
  {
    // attachments: [//🔗🖼️
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Attachment',
    //     required: [false, 'attachments is not required'],
    //   }
    // ],
    title: {
      type: String,
      required: [true, 'title is required'],
    },
    topics: {
      type: [String],
      required: [true, 'topics is required'],
    },
    userId: { //🔗
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
    },
    mentorCategoryId: { //🔗
      type: Schema.Types.ObjectId,
      ref: 'MentorCategory',
      required: [true, 'mentorCategoryId is required'],
    },
    language: {
      type: [String],
      required: [true, 'language is required'],
    },
    classType: {
      type: String,
      enum: [
        TMentorClass.online,
        TMentorClass.inPerson,
      ],
      required: [
        true,
        `classType is required it can be ${Object.values(TMentorClass).join(', ')}`,
      ],
    },
    bio: {
      type: String,
      required: [true, 'bio is required'],
    },
    sessionPrice: {
      type: Number,
      required: [true, 'sessionPrice is required'],
      min: [0, 'sessionPrice cannot be negative'],
    },
    currentJobTitle: {
      type: String,
      required: [true, 'currentJobTitle is required'],
    },
    companyName: {
      type: String,
      required: [true, 'companyName is required'],
    },
    yearsOfExperience: {
      type: Number,
      required: [true, 'yearsOfExperience is required'],
      min: [0, 'yearsOfExperience cannot be negative'],
    },
    careerStage: {
      type: [String],
      required: [true, 'careerStage is required'],
    },
    focusArea: {
      type: [String],
      required: [true, 'focusArea is required'],
    },
    industry: {
      type: String,
      required: [true, 'industry is required'],
    },
    coreValues: {
      type: [String],
      required: [true, 'coreValues is required'],
    },
    specialties: {
      type: [String],
      required: [true, 'specialties is required'],
    },
    coachingMethodologies: {
      type: [String],
      required: [true, 'coachingMethodologies is required'],
    },
    calendlyProfileLink: {
      type: String,
      required: [true, 'calendlyProfileLink is required'],
    },
    profileInfoFillUpCount: {
      type: Number,
      required: [true, 'profileInfoFillUpCount is required'],
      min: [0, 'profileInfoFillUpCount cannot be negative'],
    },
    rating: {
      type: Number,
      required: [true, 'rating is required'],
      min: [0, 'rating cannot be less than 0'],
      max: [5, 'rating cannot exceed 5'],
    },

    isDeleted: {
      type: Boolean,
      required: [false, 'isDeleted is not required'],
      default: false,
    },
  },
  { timestamps: true }
);

MentorProfileSchema.plugin(paginate);

// Use transform to rename _id to _projectId
MentorProfileSchema.set('toJSON', {
  transform: function (doc:any, ret:any, options:any) {
    ret._MentorProfileId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const MentorProfile = model<
  IMentorProfile,
  IMentorProfileModel
>('MentorProfile', MentorProfileSchema);
