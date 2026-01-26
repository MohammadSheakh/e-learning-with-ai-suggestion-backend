import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { AdminModuleProgress } from './adminModuleProgress.model';
import { IAdminModuleProgress } from './adminModuleProgress.interface';
import { AdminModuleProgressService } from './adminModuleProgress.service';

export class AdminModuleProgressController extends GenericController<
  typeof AdminModuleProgress,
  IAdminModuleProgress
> {
  AdminModuleProgressService = new AdminModuleProgressService();

  constructor() {
    super(new AdminModuleProgressService(), 'AdminModuleProgress');
  }

  // add more methods here if needed or override the existing ones 
}
