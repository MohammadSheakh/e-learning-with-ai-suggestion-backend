import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { Roadmap } from './roadmap.model';
import { IRoadmap } from './roadmap.interface';
import { RoadmapService } from './roadmap.service';

export class RoadmapController extends GenericController<
  typeof Roadmap,
  IRoadmap
> {
  RoadmapService = new RoadmapService();

  constructor() {
    super(new RoadmapService(), 'Roadmap');
  }

  // add more methods here if needed or override the existing ones 
}
