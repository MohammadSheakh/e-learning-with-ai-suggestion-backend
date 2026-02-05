//@ts-ignore
import express from 'express';
import * as validation from './capsule.validation';
import { CapsuleController} from './capsule.controller';
import { ICapsule } from './capsule.interface';
import { validateFiltersForQuery } from '../../../middlewares/queryValidation/paginationQueryValidationMiddleware';
import validateRequest from '../../../shared/validateRequest';
import auth from '../../../middlewares/auth';
//@ts-ignore
import multer from "multer";
import { TRole } from '../../../middlewares/roles';
import { imageUploadPipelineForCreateCapsule } from './capsule.middleware';
import { injectUserReference } from '../../../middlewares/injectUserReference';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

export const optionValidationChecking = <T extends keyof ICapsule | 'sortBy' | 'page' | 'limit' | 'populate'>(
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
const controller = new CapsuleController();

//
router.route('/paginate').get(
  //auth('common'),
  validateFiltersForQuery(optionValidationChecking(['_id', ...paginationOptions])),
  controller.getAllWithPagination
);

/*-───────────────────────────────── 
| Admin | get module and questions for a capsule
|  @figmaIndex 0-0
|  @desc admin can see a all modules and all questions for a capsule.. 
└──────────────────────────────────*/
router.route('/modules-nd-questions').get(
  auth(TRole.admin),
  // validateRequest(validation.createHelpMessageValidationSchema),
  controller.getModulesAndQuestionsByCapsuleId
);

router.route('/:id').get(
  // auth('common'),
  controller.getById
);

router.route('/:id').put(
  //auth('common'),
  // validateRequest(validation.createHelpMessageValidationSchema),
  controller.updateById
);

//[🚧][🧑‍💻✅][🧪] // 🆗
router.route('/').get(
  auth('commonAdmin'),
  controller.getAll
);

/*-───────────────────────────────── 
| Admin | create capsule of a journey
|  @figmaIndex 06-04
|  @desc 
└──────────────────────────────────*/
router.route('/').post(
  auth(TRole.admin),
  ...imageUploadPipelineForCreateCapsule,
  injectUserReference('adminId'),
  // validateRequest(validation.createHelpMessageValidationSchema),
  controller.create
);

router.route('/:id/permenent').delete(
  auth(TRole.common),
  controller.deleteById
);

router.route('/:id').delete(
  auth(TRole.common),
  controller.softDeleteById
);

export const CapsuleRoute = router;
