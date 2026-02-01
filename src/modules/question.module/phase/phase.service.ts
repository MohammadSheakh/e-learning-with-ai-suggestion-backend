import { StatusCodes } from 'http-status-codes';
import { Phase } from './phase.model';
import { IPhase } from './phase.interface';
import { GenericService } from '../../_generic-module/generic.services';

export class PhaseService extends GenericService<
  typeof Phase,
  IPhase
> {
  constructor() {
    super(Phase);
  }
}
