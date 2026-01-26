import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { Journey } from './journey.model';
import { IJourney } from './Journey.interface';
import { JourneyService } from './journey.service';

export class JourneyController extends GenericController<
  typeof Journey,
  IJourney
> {
  JourneyService = new JourneyService();

  constructor() {
    super(new JourneyService(), 'Journey');
  }

  // add more methods here if needed or override the existing ones 
}
