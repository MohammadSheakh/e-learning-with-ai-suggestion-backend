import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { StudentCapsuleTracker } from './studentCapsuleTracker.model';
import { IStudentCapsuleTracker } from './studentCapsuleTracker.interface';
import { StudentCapsuleTrackerService } from './studentCapsuleTracker.service';
import catchAsync from '../../../shared/catchAsync';
import ApiError from '../../../errors/ApiError';
import sendResponse from '../../../shared/sendResponse';

export class StudentCapsuleTrackerController extends GenericController<
  typeof StudentCapsuleTracker,
  IStudentCapsuleTracker
> {
  studentCapsuleTrackerService = new StudentCapsuleTrackerService();

  constructor() {
    super(new StudentCapsuleTrackerService(), 'StudentCapsuleTracker');
  }

  // update status and calculate progressPercentage and update overAllStatus
  updateById = catchAsync(async (req: Request, res: Response) => {
    // if (!req.params.id) { //----- Better approach: validate ObjectId
    //   throw new ApiError(
    //     StatusCodes.BAD_REQUEST,
    //     `id is required for update ${this.modelName}`
    //   );
    // }
    
    const id = req.params.id;

    const updatedObject = await this.studentCapsuleTrackerService.updateById(id, req.body);
    if (!updatedObject) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        `Object with ID ${id} not found`
      );
    }
    //   return res.status(StatusCodes.OK).json(updatedObject);
    sendResponse(res, {
      code: StatusCodes.OK,
      data: updatedObject,
      message: `${this.modelName} updated successfully`,
    });
  });

  // add more methods here if needed or override the existing ones 
}
