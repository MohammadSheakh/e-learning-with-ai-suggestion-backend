import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../_generic-module/generic.controller';
import { FaqCategory } from './FaqCategory.model';
import { IFaqCategory } from './FaqCategory.interface';
import { FaqCategoryService } from './FaqCategory.service';

export class FaqCategoryController extends GenericController<
  typeof FaqCategory,
  IFaqCategory
> {
  FaqCategoryService = new FaqCategoryService();

  constructor() {
    super(new FaqCategoryService(), 'FaqCategory');
  }

  // add more methods here if needed or override the existing ones 
}
