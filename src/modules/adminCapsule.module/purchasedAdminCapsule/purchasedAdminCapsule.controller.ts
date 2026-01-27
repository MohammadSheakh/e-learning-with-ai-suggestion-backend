import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { PurchasedAdminCapsule } from './purchasedAdminCapsule.model';
import { IPurchasedAdminCapsule } from './purchasedAdminCapsule.interface';
import { PurchasedAdminCapsuleService } from './purchasedAdminCapsule.service';

export class PurchasedAdminCapsuleController extends GenericController<
  typeof PurchasedAdminCapsule,
  IPurchasedAdminCapsule
> {
  PurchasedAdminCapsuleService = new PurchasedAdminCapsuleService();

  constructor() {
    super(new PurchasedAdminCapsuleService(), 'PurchasedAdminCapsule');
  }

  // add more methods here if needed or override the existing ones 
}
