import { StatusCodes } from 'http-status-codes';
import { StudentRoadMapTracker } from './studentRoadMapTracker.model';
import { IStudentRoadMapTracker } from './studentRoadMapTracker.interface';
import { GenericService } from '../../_generic-module/generic.services';


export class StudentRoadMapTrackerService extends GenericService<
  typeof StudentRoadMapTracker,
  IStudentRoadMapTracker
> {
  constructor() {
    super(StudentRoadMapTracker);
  }
}
