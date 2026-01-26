import { StatusCodes } from 'http-status-codes';
import { PurchasedAdminCapsule } from './purchasedAdminCapsule.model';
import { IPurchasedAdminCapsule } from './purchasedAdminCapsule.interface';
import { GenericService } from '../../_generic-module/generic.services';


export class PurchasedAdminCapsuleService extends GenericService<
  typeof PurchasedAdminCapsule,
  IPurchasedAdminCapsule
> {
  constructor() {
    super(PurchasedAdminCapsule);
  }
}
