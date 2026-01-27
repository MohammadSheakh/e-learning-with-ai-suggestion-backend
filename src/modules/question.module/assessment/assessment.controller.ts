import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { Assessment } from './assessment.model';
import { IAssessment } from './assessment.interface';
import { AssessmentService } from './assessment.service';

export class AssessmentController extends GenericController<
  typeof Assessment,
  IAssessment
> {
  AssessmentService = new AssessmentService();

  constructor() {
    super(new AssessmentService(), 'Assessment');
  }

  // add more methods here if needed or override the existing ones 
}
