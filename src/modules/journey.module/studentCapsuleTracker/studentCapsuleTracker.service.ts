import { StatusCodes } from 'http-status-codes';
import { StudentCapsuleTracker } from './studentCapsuleTracker.model';
import { IStudentCapsuleTracker } from './studentCapsuleTracker.interface';
import { GenericService } from '../../_generic-module/generic.services';
import ApiError from '../../../errors/ApiError';


export class StudentCapsuleTrackerService extends GenericService<
  typeof StudentCapsuleTracker,
  IStudentCapsuleTracker
> {
  constructor() {
    super(StudentCapsuleTracker);
  }

  // update status and calculate progressPercentage and update overAllStatus
  async updateById(id: string, data: IStudentCapsuleTracker) {
    const object = await this.model.findById(id).select('-__v');
    if (!object) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'No Object Found');
      //   return null;
    }

    // calculate progressPercentage and check all status to update overAllStatus
    

    return await this.model.findByIdAndUpdate(id, data, { new: true }).select('-__v');
  }
}
