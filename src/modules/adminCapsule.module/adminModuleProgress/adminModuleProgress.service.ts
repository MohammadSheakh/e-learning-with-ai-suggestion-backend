import { StatusCodes } from 'http-status-codes';
import { AdminModuleProgress } from './adminModuleProgress.model';
import { IAdminModuleProgress } from './adminModuleProgress.interface';
import { GenericService } from '../../_generic-module/generic.services';

export class AdminModuleProgressService extends GenericService<
  typeof AdminModuleProgress,
  IAdminModuleProgress
> {
  constructor() {
    super(AdminModuleProgress);
  }
}
