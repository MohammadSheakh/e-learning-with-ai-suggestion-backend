//@ts-ignore
import { model, Schema } from 'mongoose';
import { IPurchasedJourney, IPurchasedJourneyModel } from './purchasedJourney.interface';
import paginate from '../../../common/plugins/paginate';


const PurchasedJourneySchema = new Schema<IPurchasedJourney>(
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

PurchasedJourneySchema.plugin(paginate);

// Use transform to rename _id to _projectId
PurchasedJourneySchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._PurchasedJourneyId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const PurchasedJourney = model<
  IPurchasedJourney,
  IPurchasedJourneyModel
>('PurchasedJourney', PurchasedJourneySchema);
