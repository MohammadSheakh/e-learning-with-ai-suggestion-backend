//@ts-ignore
import { model, Schema } from 'mongoose';
import { IJourney, IJourneyModel } from './journey.interface';
import paginate from '../../../common/plugins/paginate';


const JourneySchema = new Schema<IJourney>(
  {
    
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // assuming Admins are also Users — adjust if you have a separate Admin model
      required: [true, 'adminId is required'],
    },
    numberOfCapsule: {
      type: Number,
      required: [true, 'numberOfCapsule is required'],
    },
    price: {
      type: Number,
      required: [true, 'price is required'],
    },
    description: {
      type: String,
      required: [true, 'description is required'],
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
  transform: function (doc:any, ret:any, options:any) {
    ret._JourneyId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const Journey = model<
  IJourney,
  IJourneyModel
>('Journey', JourneySchema);
