//@ts-ignore
import { model, Schema } from 'mongoose';
import { ILesson, ILessonModel } from './lesson.interface';
import paginate from '../../../common/plugins/paginate';


const LessonSchema = new Schema<ILesson>(
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

LessonSchema.plugin(paginate);

// Use transform to rename _id to _projectId
LessonSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._LessonId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const Lesson = model<
  ILesson,
  ILessonModel
>('Lesson', LessonSchema);
