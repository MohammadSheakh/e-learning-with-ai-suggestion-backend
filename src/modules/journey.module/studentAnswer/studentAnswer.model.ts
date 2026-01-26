//@ts-ignore
import { model, Schema } from 'mongoose';
import { IStudentAnswer, IStudentAnswerModel } from './studentAnswer.interface';
import paginate from '../../../common/plugins/paginate';


const StudentAnswerSchema = new Schema<IStudentAnswer>(
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

StudentAnswerSchema.plugin(paginate);

// Use transform to rename _id to _projectId
StudentAnswerSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._StudentAnswerId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const StudentAnswer = model<
  IStudentAnswer,
  IStudentAnswerModel
>('StudentAnswer', StudentAnswerSchema);
