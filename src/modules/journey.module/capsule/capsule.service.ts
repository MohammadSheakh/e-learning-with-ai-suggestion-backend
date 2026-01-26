import { StatusCodes } from 'http-status-codes';
import { Capsule } from './capsule.model';
import { ICapsule } from './capsule.interface';
import { GenericService } from '../../_generic-module/generic.services';


export class CapsuleService extends GenericService<
  typeof Capsule,
  ICapsule
> {
  constructor() {
    super(Capsule);
  }
}
