//@ts-ignore
import { StatusCodes } from 'http-status-codes';
import { AdminCapsule } from './adminCapsule.model';
import { IAdminCapsule } from './adminCapsule.interface';
import { GenericService } from '../../_generic-module/generic.services';


export class AdminCapsuleService extends GenericService<
  typeof AdminCapsule,
  IAdminCapsule
> {
  constructor() {
    super(AdminCapsule);
  }
}
