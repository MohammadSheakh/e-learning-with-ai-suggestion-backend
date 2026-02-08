//@ts-ignore
import { model, Schema } from 'mongoose';
import { IFaqCategory, IFaqCategoryModel } from './FaqCategory.interface';
import paginate from '../../common/plugins/paginate';


const FaqCategorySchema = new Schema<IFaqCategory>(
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

FaqCategorySchema.plugin(paginate);

// Use transform to rename _id to _projectId
FaqCategorySchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._FaqCategoryId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const FaqCategory = model<
  IFaqCategory,
  IFaqCategoryModel
>('FaqCategory', FaqCategorySchema);
