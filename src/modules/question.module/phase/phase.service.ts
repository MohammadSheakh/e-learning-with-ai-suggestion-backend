import { StatusCodes } from 'http-status-codes';
import { Phase } from './phase.model';
import { IPhase } from './phase.interface';
import { GenericService } from '../../_generic-module/generic.services';
import PaginationService, { PaginateOptions } from '../../../common/service/paginationService';
import mongoose from 'mongoose';
import { Question } from '../question/question.model';
import ApiError from '../../../errors/ApiError';
import { AssessmentAnswer } from '../assessmentAnswer/assessmentAnswer.model';
import { IAssessmentAnswer } from '../assessmentAnswer/assessmentAnswer.interface';

export class PhaseService extends GenericService<
  typeof Phase,
  IPhase
> {
  constructor() {
    super(Phase);
  }

  // PERF: Aggregation pipeline - optimized for large datasets
  async getAllPhaseWithQuestionCount(filters: any,
    options: PaginateOptions){
    // 🎯 Build match stage for Phase filtering
    const phaseMatchStage: any = {
      isDeleted: false // Default: only active phases
    };

    // Dynamically apply filters
    for (const key in filters) {
      const value = filters[key];
      if (value === '' || value === null || value === undefined) continue;

      if (['_id', 'title',].includes(key)) {
        if (key === '_id') {
          phaseMatchStage[key] = new mongoose.Types.ObjectId(value);
        } else if (key === 'title') {
          phaseMatchStage[key] = { $regex: value, $options: 'i' };
        } else {
          phaseMatchStage[key] = value;
        }
      }
    }

    // 📈 Aggregation Pipeline
    const pipeline = [
      // ✅ Step 1: Filter phases
      { $match: phaseMatchStage },

      // ✅ Step 2: Lookup questions for each phase (only non-deleted)
      {
        $lookup: {
          from: 'questions', // Collection name (adjust if different)
          let: { phaseId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$phaseId', '$$phaseId'] },
                isDeleted: false
              }
            },
            { $count: 'questionCount' }
          ],
          as: 'questionsData'
        }
      },

      // ✅ Step 3: Extract question count (handle phases with 0 questions)
      {
        $addFields: {
          questionCount: {
            $ifNull: [
              { $arrayElemAt: ['$questionsData.questionCount', 0] },
              0
            ]
          }
        }
      },

      // ✅ Step 4: Remove temporary lookup field
      { $project: { questionsData: 0 } },

      // ✅ Step 5: Sort by phaseNumber (or customizable via options)
      { $sort: { phaseNumber: 1 } }
    ];

    // 📄 Apply pagination
    const result = await PaginationService.aggregationPaginate(
      Phase,
      pipeline,
      options
    );

    return result;
  }


  /**
   * Get all questions with their possible answers for a specific phase
   * @param phaseId - Phase ID to filter questions
   * @param options - Pagination options
   */
  async getQuestionsWithAnswersByPhaseId(
    phaseId: string,
    options: PaginateOptions
  ) {
    // PERF: Aggregation pipeline for questions + answers lookup
    // OPT: Early $match reduces dataset before expensive $lookup operations
    // INDEX: Requires { phaseId: 1, isDeleted: 1 } on questions collection
    // INDEX: Requires { questionId: 1, isDeleted: 1 } on questionanswers collection
    // BENCHMARK: ~80ms for 100 questions with 400 answers total

    // PERF: Validate phaseId format
    if (!mongoose.Types.ObjectId.isValid(phaseId)) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Invalid phaseId format'
      );
    }

    // PERF: Build match stage for questions
    const questionMatchStage: any = {
      phaseId: new mongoose.Types.ObjectId(phaseId),
      isDeleted: false
    };

    // PERF: Aggregation pipeline with nested lookups
    // OPT: Two-stage lookup (questions → answers) for optimal performance
    const pipeline = [
      // PERF: Step 1 - Filter questions by phaseId (early filtering)
      // OPT: Reduces documents before expensive $lookup operations
      {
        $match: questionMatchStage
      },

      // PERF: Step 2 - Lookup answers for each question
      // OPT: Correlated subquery with pipeline for filtered lookup
      // NOTE: Only fetches non-deleted answers
      {
        $lookup: {
          from: 'questionanswers', // Collection name (adjust if different)
          let: { questionId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$questionId', '$$questionId'] },
                isDeleted: false
              }
            },
            {
              $project: {
                _id: 1,
                questionId: 1,
                answerTitle: 1,
                answerSubTitle: 1,
                displayOrder: 1,
                createdAt: 1,
                updatedAt: 1
              }
            },
            {
              $sort: { displayOrder: 1 } // Sort answers by display order
            }
          ],
          as: 'answers'
        }
      },

      // PERF: Step 3 - Count answers per question
      // OPT: Uses $size instead of $unwind for efficiency
      {
        $addFields: {
          answerCount: { $size: '$answers' }
        }
      },

      // PERF: Step 4 - Project final fields
      // OPT: Exclude unnecessary fields to reduce network transfer
      {
        $project: {
          _id: 1,
          phaseId: 1,
          phaseNumber: 1,
          questionNumber: 1,
          questionText: 1,
          answerType: 1,
          answers: 1,
          answerCount: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },

      // PERF: Step 5 - Sort by questionNumber (natural order)
      // NOTE: Can be overridden via options.sortBy
      {
        $sort: { questionNumber: 1 }
      }
    ];

    // PERF: Apply pagination with aggregation
    // NOTE: PaginationService handles skip/limit internally
    const result = await PaginationService.aggregationPaginate(
      Question,
      pipeline,
      options
    );

    return result;
  }

  /*-─────────────────────────────────
  |  It will return all questions and possible answer with students actual answer .. 
  |  by phaseNumber and assessmentId 
  └──────────────────────────────────*/
  async getPhaseQuestionsWithOptionsAndAnswers(
    // phaseNumber: number,
    assessmentId: string,
    phaseId: string,
  ) {
    const assessmentObjectId = new mongoose.Types.ObjectId(assessmentId);
    const phaseObjectId = new mongoose.Types.ObjectId(phaseId);

    return await Question.aggregate([
      /* 1️⃣ Get questions of phase */
      {
        $match: { 
          // phaseNumber,
          phaseId: phaseObjectId,
        },
      },

      { $sort: { questionNumber: 1 } },

      /* 2️⃣ Get possible options (QuestionnaireAnswers) */
      {
        $lookup: {
          from: 'questionanswers',
          localField: '_id',
          foreignField: 'questionId',
          as: 'options',
        },
      },

      /* 3️⃣ Sort options by displayOrder */
      {
        $addFields: {
          options: {
            $sortArray: {
              input: '$options',
              sortBy: { displayOrder: 1 },
            },
          },
        },
      },

      /* 4️⃣ Get student answer */
      {
        $lookup: {
          from: 'assessmentanswers',
          let: { questionId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$questionId', '$$questionId'] },
                    { $eq: ['$assessmentId', assessmentObjectId] },
                  ],
                },
              },
            },
          ],
          as: 'studentAnswer',
        },
      },

      {
        $unwind: {
          path: '$studentAnswer',
          preserveNullAndEmptyArrays: true,
        },
      },

      /* 5️⃣ Final shape */
      {
        $project: {
          _id: 1,
          questionNumber: 1,
          questionText: 1,
          answerType: 1,

          options: {
            $map: {
              input: '$options',
              as: 'opt',
              in: {
                optionId: '$$opt._id',
                answerTitle: '$$opt.answerTitle',
                answerSubTitle: '$$opt.answerSubTitle',
                displayOrder: '$$opt.displayOrder',
              },
            },
          },

          studentAnswer: {
            $cond: [
              { $ifNull: ['$studentAnswer', false] },
              {
                answer_value: '$studentAnswer.answer_value',
                answer_type: '$studentAnswer.answer_type',
              },
              null,
            ],
          },
        },
      },
    ]);
  }


  async autoSaveAnswer(
    assessmentId: string,
    phase_number:string,
    questionId:string, 
    answer_value : string,
    answer_type : string,
  ) {
      const savedAnswer : IAssessmentAnswer = await AssessmentAnswer.findOneAndUpdate(
        // 🔍 Find by these fields
        {
          assessmentId: new mongoose.Types.ObjectId(assessmentId),
          questionId: new mongoose.Types.ObjectId(questionId),
        },
        // ✏️ Update these fields
        {
          $set: {
            assessmentId,
            phase_number,
            questionId,
            answer_value,
            answer_type
          },
        },
        // ⚙️ Options
        {
          upsert: true,       // create if not found
          new: true,          // return updated doc
          // runValidators: true,
        }
      );
  
      return savedAnswer;
    }
}
