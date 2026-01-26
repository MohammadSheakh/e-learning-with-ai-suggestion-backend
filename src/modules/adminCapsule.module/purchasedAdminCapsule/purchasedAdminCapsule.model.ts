//@ts-ignore
import { model, Schema } from 'mongoose';
import { IPurchasedAdminCapsule, IPurchasedAdminCapsuleModel } from './purchasedAdminCapsule.interface';
import paginate from '../../../common/plugins/paginate';


const PurchasedAdminCapsuleSchema = new Schema<IPurchasedAdminCapsule>(
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

PurchasedAdminCapsuleSchema.plugin(paginate);

// Use transform to rename _id to _projectId
PurchasedAdminCapsuleSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._PurchasedAdminCapsuleId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const PurchasedAdminCapsule = model<
  IPurchasedAdminCapsule,
  IPurchasedAdminCapsuleModel
>('PurchasedAdminCapsule', PurchasedAdminCapsuleSchema);
