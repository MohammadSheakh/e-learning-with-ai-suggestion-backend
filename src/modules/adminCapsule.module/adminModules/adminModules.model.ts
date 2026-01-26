//@ts-ignore
import { model, Schema } from 'mongoose';
import { IAdminModules, IAdminModulesModel } from './adminModules.interface';
import paginate from '../../../common/plugins/paginate';


const AdminModulesSchema = new Schema<IAdminModules>(
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

AdminModulesSchema.plugin(paginate);

// Use transform to rename _id to _projectId
AdminModulesSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._AdminModulesId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const AdminModules = model<
  IAdminModules,
  IAdminModulesModel
>('AdminModules', AdminModulesSchema);
