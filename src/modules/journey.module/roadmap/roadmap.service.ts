import { StatusCodes } from 'http-status-codes';
import { Roadmap } from './roadmap.model';
import { IRoadmap } from './roadmap.interface';
import { GenericService } from '../../_generic-module/generic.services';


export class RoadmapService extends GenericService<
  typeof Roadmap,
  IRoadmap
> {
  constructor() {
    super(Roadmap);
  }
}
