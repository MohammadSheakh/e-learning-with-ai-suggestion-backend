//@ts-ignore
import { model, Schema } from 'mongoose';
import { ICapsule, ICapsuleModel } from './capsule.interface';
import paginate from '../../../common/plugins/paginate';


const CapsuleSchema = new Schema<ICapsule>(
  {
    
    capsuleNumber: {
      type: Number,
      required: [true, 'capsuleNumber is required'],
      min: [1, 'capsuleNumber must be at least 1'],
    },
    title: {
      type: String,
      required: [true, 'title is required'],
      trim: true,
    },
    subTitle: {
      type: String,
      required: [true, 'subTitle is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'description is required'],
    },
    missionBriefing: {
      type: String,
      required: [true, 'missionBriefing is required'],
    },

    introductionVideo: [//🔗🖼️
      {
        type: Schema.Types.ObjectId,
        ref: 'Attachment',
        required: [false, 'attachments is not required'],
      }
    ],
    attachments: [//🔗🖼️
      {
        type: Schema.Types.ObjectId,
        ref: 'Attachment',
        required: [false, 'attachments is not required'],
      }
    ],

    journeyId: { //🔗
      type: Schema.Types.ObjectId,
      ref: 'Journey', // FK to Journey model
      required: [true, 'journeyId is required'],
    },
    totalModule: {
      type: Number,
      required: [true, 'totalModule is required'],
      min: [0, 'totalModule cannot be negative'],
    },
    adminId: { //🔗
      type: Schema.Types.ObjectId,
      ref: 'User', // assuming admins are Users — adjust if separate Admin model
      required: [true, 'adminId is required'],
    },


    isDeleted: {
      type: Boolean,
      required: [false, 'isDeleted is not required'],
      default: false,
    },
  },
  { timestamps: true }
);

CapsuleSchema.plugin(paginate);

// Use transform to rename _id to _projectId
CapsuleSchema.set('toJSON', {
  transform: function (doc:any, ret:any, options:any) {
    ret._CapsuleId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const Capsule = model<
  ICapsule,
  ICapsuleModel
>('Capsule', CapsuleSchema);
