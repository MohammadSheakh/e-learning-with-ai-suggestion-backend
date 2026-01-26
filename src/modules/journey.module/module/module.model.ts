//@ts-ignore
import { model, Schema } from 'mongoose';
import { IModule, IModuleModel } from './module.interface';
import paginate from '../../../common/plugins/paginate';


const ModuleSchema = new Schema<IModule>(
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

ModuleSchema.plugin(paginate);

// Use transform to rename _id to _projectId
ModuleSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._ModuleId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const Module = model<
  IModule,
  IModuleModel
>('Module', ModuleSchema);
