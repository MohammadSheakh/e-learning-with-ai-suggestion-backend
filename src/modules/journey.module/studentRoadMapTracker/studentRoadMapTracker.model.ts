//@ts-ignore
import { model, Schema } from 'mongoose';
import { IStudentRoadMapTracker, IStudentRoadMapTrackerModel } from './studentRoadMapTracker.interface';
import paginate from '../../../common/plugins/paginate';
import { TStudentRoadMapTrackerStatus } from './studentRoadMapTracker.constant';


const StudentRoadMapTrackerSchema = new Schema<IStudentRoadMapTracker>(
  {
    roadMapId: { //🔗
      type: Schema.Types.ObjectId,
      ref: 'Roadmap',
      required: [true, 'roadMapId is required'],
    },
    studentId: { //🔗
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'studentId is required'],
    },
    status: {
      type: String,
      enum: [
        TStudentRoadMapTrackerStatus.inProgress,
        TStudentRoadMapTrackerStatus.completed,
      ],
      required: [
        true,
        `status is required it can be ${Object.values(TStudentRoadMapTrackerStatus).join(', ')}`,
      ],
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
  transform: function (doc:any, ret:any, options:any) {
    ret._StudentRoadMapTrackerId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const StudentRoadMapTracker = model<
  IStudentRoadMapTracker,
  IStudentRoadMapTrackerModel
>('StudentRoadMapTracker', StudentRoadMapTrackerSchema);
