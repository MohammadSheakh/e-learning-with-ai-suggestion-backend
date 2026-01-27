import { StatusCodes } from 'http-status-codes';
import { Phase } from './Phase.model';
import { IPhase } from './Phase.interface';
import { GenericService } from '../../_generic-module/generic.services';


export class PhaseService extends GenericService<
  typeof Phase,
  IPhase
> {
  constructor() {
    super(Phase);
  }
}
