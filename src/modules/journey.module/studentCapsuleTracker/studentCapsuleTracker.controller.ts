import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { StudentCapsuleTracker } from './studentCapsuleTracker.model';
import { IStudentCapsuleTracker } from './studentCapsuleTracker.interface';
import { StudentCapsuleTrackerService } from './studentCapsuleTracker.service';

export class StudentCapsuleTrackerController extends GenericController<
  typeof StudentCapsuleTracker,
  IStudentCapsuleTracker
> {
  StudentCapsuleTrackerService = new StudentCapsuleTrackerService();

  constructor() {
    super(new StudentCapsuleTrackerService(), 'StudentCapsuleTracker');
  }

  // add more methods here if needed or override the existing ones 
}
