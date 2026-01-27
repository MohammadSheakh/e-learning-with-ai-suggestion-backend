import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { Phase } from './phase.model';
import { IPhase } from './phase.interface';
import { PhaseService } from './phase.service';

export class PhaseController extends GenericController<
  typeof Phase,
  IPhase
> {
  PhaseService = new PhaseService();

  constructor() {
    super(new PhaseService(), 'Phase');
  }

  // add more methods here if needed or override the existing ones 
}
