import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../_generic-module/generic.controller';
import { Faq } from './Faq.model';
import { IFaq } from './Faq.interface';
import { FaqService } from './Faq.service';

export class FaqController extends GenericController<
  typeof Faq,
  IFaq
> {
  FaqService = new FaqService();

  constructor() {
    super(new FaqService(), 'Faq');
  }

  // add more methods here if needed or override the existing ones 
}
