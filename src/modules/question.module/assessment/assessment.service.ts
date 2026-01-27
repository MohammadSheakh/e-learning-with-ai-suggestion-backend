import { StatusCodes } from 'http-status-codes';
import { Assessment } from './assessment.model';
import { IAssessment } from './assessment.interface';
import { GenericService } from '../../_generic-module/generic.services';

export class AssessmentService extends GenericService<
  typeof Assessment,
  IAssessment
> {
  constructor() {
    super(Assessment);
  }
}
