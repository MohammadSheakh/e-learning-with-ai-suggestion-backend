//@ts-ignore
import { model, Schema } from 'mongoose';
import { IRoadmap, IRoadmapModel } from './roadmap.interface';
import paginate from '../../../common/plugins/paginate';
import { TRoadmap } from './roadmap.constant';


const RoadmapSchema = new Schema<IRoadmap>(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
    },
    description: {
      type: String,
      required: [true, 'description is required'],
    },
    type: { //🖼️🧩 
      type: String,
      enum: [
        TRoadmap.introduction,
        TRoadmap.modules,
        TRoadmap.question,
        TRoadmap.exercise,
        TRoadmap.summary,
      ],
      required: [
        true,
        `type is required it can be ${Object.values(TRoadmap).join(', ')}`,
      ],
    }, 
    capsuleId: { //🔗
      type: Schema.Types.ObjectId,
      ref: 'Capsule',
      required: [true, 'capsuleId is required'],
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
  transform: function (doc:any, ret:any, options:any) {
    ret._RoadmapId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const Roadmap = model<
  IRoadmap,
  IRoadmapModel
>('Roadmap', RoadmapSchema);
