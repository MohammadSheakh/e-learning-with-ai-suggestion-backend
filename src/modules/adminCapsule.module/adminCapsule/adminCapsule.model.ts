//@ts-ignore
import { model, Schema } from 'mongoose';
import { IAdminCapsule, IAdminCapsuleModel } from './adminCapsule.interface';
import paginate from '../../../common/plugins/paginate';


const AdminCapsuleSchema = new Schema<IAdminCapsule>(
  {
    userId: { //🔗
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: [true, 'dateOfBirth is required'],
    },
    isDeleted: {
      type: Boolean,
      required: [false, 'isDeleted is not required'],
      default: false,
    },
  },
  { timestamps: true }
);

AdminCapsuleSchema.plugin(paginate);

// Use transform to rename _id to _projectId
AdminCapsuleSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._AdminCapsuleId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const AdminCapsule = model<
  IAdminCapsule,
  IAdminCapsuleModel
>('AdminCapsule', AdminCapsuleSchema);
