import { StatusCodes } from 'http-status-codes';
import { PurchasedJourney } from './purchasedJourney.model';
import { IPurchasedJourney } from './purchasedJourney.interface';
import { GenericService } from '../../_generic-module/generic.services';


export class PurchasedJourneyService extends GenericService<
  typeof PurchasedJourney,
  IPurchasedJourney
> {
  constructor() {
    super(PurchasedJourney);
  }
}
