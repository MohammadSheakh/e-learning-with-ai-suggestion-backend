//@ts-ignore
import { model, Schema } from 'mongoose';
import { ICapsule, ICapsuleModel } from './capsule.interface';
import paginate from '../../../common/plugins/paginate';


const CapsuleSchema = new Schema<ICapsule>(
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

CapsuleSchema.plugin(paginate);

// Use transform to rename _id to _projectId
CapsuleSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._CapsuleId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const Capsule = model<
  ICapsule,
  ICapsuleModel
>('Capsule', CapsuleSchema);
