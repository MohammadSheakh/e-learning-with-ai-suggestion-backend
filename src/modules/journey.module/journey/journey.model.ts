//@ts-ignore
import { model, Schema } from 'mongoose';
import { IJourney, IJourneyModel } from './journey.interface';
import paginate from '../../../common/plugins/paginate';


const JourneySchema = new Schema<IJourney>(
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

JourneySchema.plugin(paginate);

// Use transform to rename _id to _projectId
JourneySchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._JourneyId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const Journey = model<
  IJourney,
  IJourneyModel
>('Journey', JourneySchema);
