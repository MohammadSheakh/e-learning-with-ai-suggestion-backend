import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { PurchasedJourney } from './purchasedJourney.model';
import { IPurchasedJourney } from './purchasedJourney.interface';
import { PurchasedJourneyService } from './purchasedJourney.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from '../../token/token.interface';

export class PurchasedJourneyController extends GenericController<
  typeof PurchasedJourney,
  IPurchasedJourney
> {
  purchasedJourneyService = new PurchasedJourneyService();

  constructor() {
    super(new PurchasedJourneyService(), 'PurchasedJourney');
  }

  create = catchAsync(async (req: Request, res: Response) => {
    
    // const data:ITrainingProgramPurchase = req.body;
  
    const result = await this.purchasedJourneyService.createV2(req.params.journeyId, req.user as IUser);

    sendResponse(res, {
      code: StatusCodes.OK,
      data: result,
      message: `${this.modelName} created successfully`,
      success: true,
    });
  });

  // add more methods here if needed or override the existing ones 
}
