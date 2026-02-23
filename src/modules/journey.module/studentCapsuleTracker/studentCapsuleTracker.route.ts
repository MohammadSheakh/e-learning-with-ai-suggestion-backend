//@ts-ignore
import express from 'express';
import * as validation from './studentCapsuleTracker.validation';
import { StudentCapsuleTrackerController} from './studentCapsuleTracker.controller';
import { IStudentCapsuleTracker } from './studentCapsuleTracker.interface';
import { validateFiltersForQuery } from '../../../middlewares/queryValidation/paginationQueryValidationMiddleware';
import validateRequest from '../../../shared/validateRequest';
import auth from '../../../middlewares/auth';
//@ts-ignore
import multer from "multer";
import { TRole } from '../../../middlewares/roles';
import { setQueryOptions } from '../../../middlewares/setQueryOptions';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

export const optionValidationChecking = <T extends keyof IStudentCapsuleTracker | 'sortBy' | 'page' | 'limit' | 'populate'>(
  filters: T[]
) => {
  return filters;
};

const paginationOptions: Array<'sortBy' | 'page' | 'limit' | 'populate'> = [
  'sortBy',
  'page',
  'limit',
  'populate',
];

// const taskService = new TaskService();
const controller = new StudentCapsuleTrackerController();


router.route('/paginate').get(
  auth(TRole.common),
  validateFiltersForQuery(optionValidationChecking(['_id', ...paginationOptions])),
  controller.getAllWithPagination
);

/*-───────────────────────────────── 
| Student | get capsule introduction by id
|  @figmaIndex Exploration Journey Section | After purchase | 3 no. screen
|  @desc 
└──────────────────────────────────*/
router.route('/:id/introduction').get(
  auth(TRole.common),
  setQueryOptions({
      populate: [
        { 
          path : "capsuleId", 
          select: "capsuleNumber title introDescription introductionVideo",
          populate: { 
            path : "introductionVideo",
            select : "attachment"
          } 
        }
      ],
      select: '-isDeleted -createdAt -updatedAt -title -capsuleNumber -__v -aiSummaryContent -aiSummaryStatus -aiSummaryGeneratedAt'
    }),
  controller.getByIdV2
);


/*-───────────────────────────────── 
| Student | change 'introStatus' to  'completed' and 'inspirationStatus' to 'inProgress'
|  @figmaIndex Exploration Journey Section | After purchase | 3 no. screen
|  @desc  update status and calculate progressPercentage and update overAllStatus
└──────────────────────────────────*/
router.route('/:id').put(
  auth(TRole.common),
  // validateRequest(validation.createHelpMessageValidationSchema),
  controller.updateById
);


// router.route('/').get(
//   auth(TRole.common),
//   controller.getAll
// );


/*-───────────────────────────────── 
|  | create  
|  @figmaIndex 06-04
|  @desc 
└──────────────────────────────────*/
// router.route('/').post(
//   ...imageUploadPipelineForCreateStudentCapsuleTracker,
//   auth(TRole.common),
//   validateRequest(validation.createHelpMessageValidationSchema),
//   controller.create
// );


// router.route('/:id/permenent').delete(
//   auth(TRole.common),
//   controller.deleteById
// );


// router.route('/:id').delete(
//   auth(TRole.common),
//   controller.softDeleteById
// );



export const StudentCapsuleTrackerRoute = router;
