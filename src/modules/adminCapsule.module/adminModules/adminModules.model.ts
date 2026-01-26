//@ts-ignore
import { model, Schema } from 'mongoose';
import { IAdminModules, IAdminModulesModel } from './adminModules.interface';
import paginate from '../../../common/plugins/paginate';


const AdminModulesSchema = new Schema<IAdminModules>(
  {
  
    title: {
      type: String,
      required: [true, 'title is required'],
    },
    description: {
      type: String,
      required: [true, 'description is required'],
    },
    attachments: [ //🔗🖼️
      {
        type: Schema.Types.ObjectId,
        ref: 'Attachment',
        required: [false, 'attachments is not required'],
      }
    ],
    capsuleId: { //🔗
      type: Schema.Types.ObjectId,
      ref: 'Capsule',
      required: [true, 'capsuleId is required'],
    },
    estimatedTime: {
      type: Number,
      required: [true, 'estimatedTime is required'],
      min: [0, 'estimatedTime cannot be negative'],
    },

    isDeleted: {
      type: Boolean,
      required: [false, 'isDeleted is not required'],
      default: false,
    },
  },
  { timestamps: true }
);

AdminModulesSchema.plugin(paginate);

// Use transform to rename _id to _projectId
AdminModulesSchema.set('toJSON', {
  transform: function (doc:any, ret:any, options:any) {
    ret._AdminModulesId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const AdminModules = model<
  IAdminModules,
  IAdminModulesModel
>('AdminModules', AdminModulesSchema);
