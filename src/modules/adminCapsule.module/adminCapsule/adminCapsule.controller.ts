//@ts-ignore
import { Request, Response } from 'express';
//@ts-ignore
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { AdminCapsule } from './adminCapsule.model';
import { IAdminCapsule } from './adminCapsule.interface';
import { AdminCapsuleService } from './adminCapsule.service';

export class AdminCapsuleController extends GenericController<
  typeof AdminCapsule,
  IAdminCapsule
> {
  AdminCapsuleService = new AdminCapsuleService();

  constructor() {
    super(new AdminCapsuleService(), 'AdminCapsule');
  }

  // add more methods here if needed or override the existing ones 
}
