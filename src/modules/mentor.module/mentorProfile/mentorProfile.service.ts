import { StatusCodes } from 'http-status-codes';
import { MentorProfile } from './mentorProfile.model';
import { IMentorProfile } from './mentorProfile.interface';
import { GenericService } from '../../_generic-module/generic.services';


export class MentorProfileService extends GenericService<
  typeof MentorProfile,
  IMentorProfile
> {
  constructor() {
    super(MentorProfile);
  }

  async updateMentorProfile (data : string, mentorId: string) {
    await this.
  } 

}
