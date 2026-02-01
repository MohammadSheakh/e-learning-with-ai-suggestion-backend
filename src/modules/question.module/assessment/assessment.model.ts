//@ts-ignore
import { model, Schema } from 'mongoose';
import { IAssessment, IAssessmentModel } from './assessment.interface';
import paginate from '../../../common/plugins/paginate';

const AssessmentSchema = new Schema<IAssessment>(
  {
    userId: { //🔗
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    is_completed: {
      type: Boolean,
      required: [true, 'is_completed is required'],
    },
    current_phaseId: {  //🔗
      type: Schema.Types.ObjectId,
      ref: 'Phase',
      required: [true, 'current_phaseId is required'],
    },
    current_questionId: {  //🔗
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: [true, 'current_questionId is required'],
    },
    currentPhaseNumber: {
      type: Number,
      required: [true, 'currentPhaseNumber is required'],
      min: [1, 'currentPhaseNumber must be at least 1'],
    },
    currentQuestionNumber: {
      type: Number,
      required: [true, 'currentQuestionNumber is required'],
      min: [1, 'currentQuestionNumber must be at least 1'],
    },

    isDeleted: {
      type: Boolean,
      required: [false, 'isDeleted is not required'],
      default: false,
    },
  },
  { timestamps: true }
);

AssessmentSchema.plugin(paginate);

// Use transform to rename _id to _projectId
AssessmentSchema.set('toJSON', {
  transform: function (doc:any, ret:any, options:any) {
    ret._AssessmentId = ret._id; // Rename _id to _subscriptionId
    delete ret._id; // Remove the original _id field
    return ret;
  },
});

export const Assessment = model<
  IAssessment,
  IAssessmentModel
>('Assessment', AssessmentSchema);
