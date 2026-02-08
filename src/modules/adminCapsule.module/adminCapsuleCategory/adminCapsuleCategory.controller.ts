import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { AdminCapsuleCategory } from './adminCapsuleCategory.model';
import { IAdminCapsuleCategory } from './adminCapsuleCategory.interface';
import { AdminCapsuleCategoryService } from './adminCapsuleCategory.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';

export class AdminCapsuleCategoryController extends GenericController<
  typeof AdminCapsuleCategory,
  IAdminCapsuleCategory
> {
  adminCapsuleCategoryService = new AdminCapsuleCategoryService();

  constructor() {
    super(new AdminCapsuleCategoryService(), 'AdminCapsuleCategory');
  }


  getAllCapsulesByCategoryId = catchAsync(async (req: Request, res: Response) => {
    const { capsuleCategoryId } = req.params;
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);

    
    // const result = await this.adminCapsuleCategoryService.getAllCapsulesByCategoryId(options, capsuleCategoryId);
    const result = await this.adminCapsuleCategoryService.getAllCapsulesByCategoryIdV2(options, capsuleCategoryId);

    sendResponse(res, {
      code: StatusCodes.OK,
      data: result,
      message: `all admin capsules retrived successfully by categoryId`,
      success: true,
    });
  });

  // add more methods here if needed or override the existing ones 
}
