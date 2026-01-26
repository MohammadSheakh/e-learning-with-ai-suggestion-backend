//@ts-ignore
import { model, Schema } from 'mongoose';
import { IRoadmap, IRoadmapModel } from './roadmap.interface';
import paginate from '../../../common/plugins/paginate';


const RoadmapSchema = new Schema<IRoadmap>(
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

RoadmapSchema.plugin(paginate);

// Use transform to rename _id to _projectId
RoadmapSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._RoadmapId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const Roadmap = model<
  IRoadmap,
  IRoadmapModel
>('Roadmap', RoadmapSchema);
