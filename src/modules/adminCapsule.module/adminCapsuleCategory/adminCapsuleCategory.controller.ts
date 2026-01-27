import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { AdminCapsuleCategory } from './adminCapsuleCategory.model';
import { IAdminCapsuleCategory } from './adminCapsuleCategory.interface';
import { AdminCapsuleCategoryService } from './adminCapsuleCategory.service';

export class AdminCapsuleCategoryController extends GenericController<
  typeof AdminCapsuleCategory,
  IAdminCapsuleCategory
> {
  AdminCapsuleCategoryService = new AdminCapsuleCategoryService();

  constructor() {
    super(new AdminCapsuleCategoryService(), 'AdminCapsuleCategory');
  }

  // add more methods here if needed or override the existing ones 
}
