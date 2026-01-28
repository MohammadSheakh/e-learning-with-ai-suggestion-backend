import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../../_generic-module/generic.controller';
import { MentorProfile } from './mentorProfile.model';
import { IMentorProfile } from './mentorProfile.interface';
import { MentorProfileService } from './mentorProfile.service';

export class MentorProfileController extends GenericController<
  typeof MentorProfile,
  IMentorProfile
> {
  MentorProfileService = new MentorProfileService();

  constructor() {
    super(new MentorProfileService(), 'MentorProfile');
  }

  // add more methods here if needed or override the existing ones 
}
