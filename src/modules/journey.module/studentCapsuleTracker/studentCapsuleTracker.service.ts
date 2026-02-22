import { StatusCodes } from 'http-status-codes';
import { StudentCapsuleTracker } from './studentCapsuleTracker.model';
import { IStudentCapsuleTracker } from './studentCapsuleTracker.interface';
import { GenericService } from '../../_generic-module/generic.services';


export class StudentCapsuleTrackerService extends GenericService<
  typeof StudentCapsuleTracker,
  IStudentCapsuleTracker
> {
  constructor() {
    super(StudentCapsuleTracker);
  }
}
