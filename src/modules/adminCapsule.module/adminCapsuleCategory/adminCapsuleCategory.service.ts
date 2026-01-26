import { StatusCodes } from 'http-status-codes';
import { AdminCapsuleCategory } from './adminCapsuleCategory.model';
import { IAdminCapsuleCategory } from './adminCapsuleCategory.interface';
import { GenericService } from '../../_generic-module/generic.services';


export class AdminCapsuleCategoryService extends GenericService<
  typeof AdminCapsuleCategory,
  IAdminCapsuleCategory
> {
  constructor() {
    super(AdminCapsuleCategory);
  }
}
