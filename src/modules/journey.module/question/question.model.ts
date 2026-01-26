//@ts-ignore
import { model, Schema } from 'mongoose';
import { IQuestion, IQuestionModel } from './question.interface';
import paginate from '../../../common/plugins/paginate';


const QuestionSchema = new Schema<IQuestion>(
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

QuestionSchema.plugin(paginate);

// Use transform to rename _id to _projectId
QuestionSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret._QuestionId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const Question = model<
  IQuestion,
  IQuestionModel
>('Question', QuestionSchema);
