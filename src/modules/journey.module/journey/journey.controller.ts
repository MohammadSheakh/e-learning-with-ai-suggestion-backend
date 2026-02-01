import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { Journey } from './journey.model';
import { IJourney } from './journey.interface';
import { JourneyService } from './journey.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

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

