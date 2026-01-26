//@ts-ignore
import { model, Schema } from 'mongoose';
import { ILessonProgress, ILessonProgressModel } from './lessonProgress.interface';
import paginate from '../../../common/plugins/paginate';


const LessonProgressSchema = new Schema<ILessonProgress>(
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

LessonProgressSchema.plugin(paginate);

// Use transform to rename _id to _projectId
LessonProgressSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._LessonProgressId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const LessonProgress = model<
  ILessonProgress,
  ILessonProgressModel
>('LessonProgress', LessonProgressSchema);
