import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CalendlyService } from './calendly.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Buffer } from 'buffer';

export class CalendlyController  {
  calendlyService = new CalendlyService();

  

  redirectToCalendlyAuth = catchAsync(async (req: Request, res: Response) => {
    
    // Optional: Pass user ID in state for validation (base64 encoded)
    const state = Buffer.from(JSON.stringify({ 
      userId: req.user.id, 
      timestamp: Date.now() 
    })).toString('base64');
    
    const authUrl = this.calendlyService.getAuthUrl(state);

    res.redirect(authUrl);

    // sendResponse(res, {
    //   code: StatusCodes.OK,
    //   data: result,
    //   message: `${this.modelName} created successfully`,
    //   success: true,
    // });
  });

  // add more methods here if needed or override the existing ones 
}
