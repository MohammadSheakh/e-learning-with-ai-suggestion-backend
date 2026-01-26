//@ts-ignore
import { model, Schema } from 'mongoose';
import { IStudentRoadMapTracker, IStudentRoadMapTrackerModel } from './studentRoadMapTracker.interface';
import paginate from '../../../common/plugins/paginate';


const StudentRoadMapTrackerSchema = new Schema<IStudentRoadMapTracker>(
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

StudentRoadMapTrackerSchema.plugin(paginate);

// Use transform to rename _id to _projectId
StudentRoadMapTrackerSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._StudentRoadMapTrackerId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const StudentRoadMapTracker = model<
  IStudentRoadMapTracker,
  IStudentRoadMapTrackerModel
>('StudentRoadMapTracker', StudentRoadMapTrackerSchema);
