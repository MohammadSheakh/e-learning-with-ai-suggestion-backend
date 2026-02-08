import { StatusCodes } from 'http-status-codes';
import { FaqCategory } from './FaqCategory.model';
import { IFaqCategory } from './FaqCategory.interface';
import { GenericService } from '../_generic-module/generic.services';


export class FaqCategoryService extends GenericService<
  typeof FaqCategory,
  IFaqCategory
> {
  constructor() {
    super(FaqCategory);
  }
}
