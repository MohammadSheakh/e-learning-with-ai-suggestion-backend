import { StatusCodes } from 'http-status-codes';
import { Journey } from './journey.model';
import { IJourney } from './journey.interface';
import { GenericService } from '../../_generic-module/generic.services';


export class JourneyService extends GenericService<
  typeof Journey,
  IJourney
> {
  constructor() {
    super(Journey);
  }
}
