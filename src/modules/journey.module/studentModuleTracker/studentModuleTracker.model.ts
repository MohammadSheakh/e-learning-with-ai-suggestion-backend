//@ts-ignore
import { model, Schema } from 'mongoose';
import { IStudentModuleTracker, IStudentModuleTrackerModel } from './studentModuleTracker.interface';
import paginate from '../../../common/plugins/paginate';


const StudentModuleTrackerSchema = new Schema<IStudentModuleTracker>(
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

StudentModuleTrackerSchema.plugin(paginate);

// Use transform to rename _id to _projectId
StudentModuleTrackerSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._StudentModuleTrackerId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const StudentModuleTracker = model<
  IStudentModuleTracker,
  IStudentModuleTrackerModel
>('StudentModuleTracker', StudentModuleTrackerSchema);
