import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { Capsule } from './capsule.model';
import { ICapsule } from './Capsule.interface';
import { CapsuleService } from './capsule.service';

export class CapsuleController extends GenericController<
  typeof Capsule,
  ICapsule
> {
  CapsuleService = new CapsuleService();

  constructor() {
    super(new CapsuleService(), 'Capsule');
  }

  // add more methods here if needed or override the existing ones 
}
