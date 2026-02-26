import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { PurchasedAdminCapsule } from './purchasedAdminCapsule.model';
import { IPurchasedAdminCapsule } from './purchasedAdminCapsule.interface';
import { PurchasedAdminCapsuleService } from './purchasedAdminCapsule.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from '../../token/token.interface';

export class PurchasedAdminCapsuleController extends GenericController<
  typeof PurchasedAdminCapsule,
  IPurchasedAdminCapsule
> {
  purchasedAdminCapsuleService = new PurchasedAdminCapsuleService();

  constructor() {
    super(new PurchasedAdminCapsuleService(), 'PurchasedAdminCapsule');
  }

  create = catchAsync(async (req: Request, res: Response) => {
    
    // const data:ITrainingProgramPurchase = req.body;
  
    const result = await this.purchasedAdminCapsuleService.createV2(req.params.adminCapsuleId, req.user as IUser);

    sendResponse(res, {
      code: StatusCodes.OK,
      data: result,
      message: `${this.modelName} created successfully`,
      success: true,
    });
  });

  
  getAllWithGiftedAndCategories = catchAsync(async (req: Request, res: Response) => {
    
    console.log("hit ttttt");

    const result = await this.purchasedAdminCapsuleService.getAllWithGiftedAndCategories(req.user as IUser);

    sendResponse(res, {
      code: StatusCodes.OK,
      data: result,
      message: `${this.modelName} created successfully`,
      success: true,
    });
  });

  // add more methods here if needed or override the existing ones 
}
