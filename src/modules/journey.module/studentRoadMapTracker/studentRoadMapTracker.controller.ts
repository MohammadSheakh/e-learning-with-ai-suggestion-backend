import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { StudentRoadMapTracker } from './studentRoadMapTracker.model';
import { IStudentRoadMapTracker } from './studentRoadMapTracker.interface';
import { StudentRoadMapTrackerService } from './studentRoadMapTracker.service';

export class StudentRoadMapTrackerController extends GenericController<
  typeof StudentRoadMapTracker,
  IStudentRoadMapTracker
> {
  StudentRoadMapTrackerService = new StudentRoadMapTrackerService();

  constructor() {
    super(new StudentRoadMapTrackerService(), 'StudentRoadMapTracker');
  }

  // add more methods here if needed or override the existing ones 
}
