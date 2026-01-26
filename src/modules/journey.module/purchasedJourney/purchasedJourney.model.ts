//@ts-ignore
import { model, Schema } from 'mongoose';
import { IPurchasedJourney, IPurchasedJourneyModel } from './purchasedJourney.interface';
import paginate from '../../../common/plugins/paginate';


const PurchasedJourneySchema = new Schema<IPurchasedJourney>(
  {
    journeyId: { //🔗
      type: Schema.Types.ObjectId,
      ref: 'Journey',
      required: [true, 'journeyId is required'],
    },
    studentId: { //🔗
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'studentId is required'],
    },
    studentsAnswer: {
      type: String,
      required: [true, 'studentsAnswer is required'],
    },
    aiSummary: {
      type: String,
      required: [true, 'aiSummary is required'],
    },
    isDeleted: {
      type: Boolean,
      required: [false, 'isDeleted is not required'],
      default: false,
    },
  },
  { timestamps: true }
);

PurchasedJourneySchema.plugin(paginate);

// Use transform to rename _id to _projectId
PurchasedJourneySchema.set('toJSON', {
  transform: function (doc:any, ret:any, options:any) {
    ret._PurchasedJourneyId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const PurchasedJourney = model<
  IPurchasedJourney,
  IPurchasedJourneyModel
>('PurchasedJourney', PurchasedJourneySchema);
