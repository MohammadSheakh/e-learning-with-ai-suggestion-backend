import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { PurchasedJourney } from './purchasedJourney.model';
import { IPurchasedJourney } from './PurchasedJourney.interface';
import { PurchasedJourneyService } from './purchasedJourney.service';

export class PurchasedJourneyController extends GenericController<
  typeof PurchasedJourney,
  IPurchasedJourney
> {
  PurchasedJourneyService = new PurchasedJourneyService();

  constructor() {
    super(new PurchasedJourneyService(), 'PurchasedJourney');
  }

  // add more methods here if needed or override the existing ones 
}
