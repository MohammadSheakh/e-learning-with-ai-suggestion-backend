import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { Phase } from './phase.model';
import { ICreatePhase, IPhase } from './phase.interface';
import { PhaseService } from './phase.service';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';

export class PhaseController extends GenericController<
  typeof Phase,
  IPhase
> {
  PhaseService = new PhaseService();

  constructor() {
    super(new PhaseService(), 'Phase');
  }

  create = catchAsync(async (req: Request, res: Response) => {
    const data:IPhase = req.body;

    const phaseCount = await Phase.countDocuments({ isDeleted: false });

    console.log("phaseCount", phaseCount);

    const phaseDTO: ICreatePhase = {
      // attachment will be given by admin later
      title: data.title,
      subTitle:  data.subTitle, /// as provider create this .. 
      phaseNumber : phaseCount + 1,
    }

    const result = await this.service.create(phaseDTO);

    sendResponse(res, {
      code: StatusCodes.OK,
      data: result,
      message: `${this.modelName} created successfully`,
      success: true,
    });
  });

  // add more methods here if needed or override the existing ones 
}
