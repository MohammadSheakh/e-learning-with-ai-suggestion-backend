//@ts-ignore
import { model, Schema } from 'mongoose';
import { IAdminCapsuleCategory, IAdminCapsuleCategoryModel } from './adminCapsuleCategory.interface';
import paginate from '../../../common/plugins/paginate';


const AdminCapsuleCategorySchema = new Schema<IAdminCapsuleCategory>(
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

AdminCapsuleCategorySchema.plugin(paginate);

// Use transform to rename _id to _projectId
AdminCapsuleCategorySchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._AdminCapsuleCategoryId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const AdminCapsuleCategory = model<
  IAdminCapsuleCategory,
  IAdminCapsuleCategoryModel
>('AdminCapsuleCategory', AdminCapsuleCategorySchema);
