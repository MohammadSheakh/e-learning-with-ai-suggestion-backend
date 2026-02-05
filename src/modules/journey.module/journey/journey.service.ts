import { StatusCodes } from 'http-status-codes';
import { Journey } from './journey.model';
import { IJourney } from './journey.interface';
import { GenericService } from '../../_generic-module/generic.services';
import ApiError from '../../../errors/ApiError';
import { PaginateOptions } from '../../../types/paginate';
import PaginationService from '../../../common/service/paginationService';


export class JourneyService extends GenericService<
  typeof Journey,
  IJourney
> {
  constructor() {
    super(Journey);
  }

  async getJourneyDetailsWithCapsules (
      options: PaginateOptions) {
    const jouneyExist = await Journey.findOne({ isDeleted: false });

    if(!jouneyExist){
      throw new ApiError(StatusCodes.BAD_REQUEST, "Jounery not found.");
    }

    const matchStage : any = {
      isDeleted : false,
      
    }

    const pipeline = [
      {
        $match : matchStage
      },
      // lookup capsules for each journey .. though we have just one journey
      {
        $lookup : {
          from : 'capsules', // collectionName
          let : { journeyId : '$_id'},
          pipeline : [
            {
              $match : {
                $expr : { $eq : ['$journeyId', '$$journeyId'] },
                isDeleted : false,
              }
            },
            { // ------- project from capsule fields.. 
              $project: {
                _id: 1,
                title: 1,
                description: 1,
                capsuleNumber: 1,
              },
            },
          ],
          as : 'journeyCapsules',
        }
      },
      {
        $project: { // - from journey table .. 
          _id: 1,
          title: 1,
          brief: 1,
          price: 1,
          journeyCapsules : 1,
        },
      },

    ]

    const result = await PaginationService.aggregationPaginate(
      Journey,
      pipeline,
      options,
    )

    return result;
  } 
}
