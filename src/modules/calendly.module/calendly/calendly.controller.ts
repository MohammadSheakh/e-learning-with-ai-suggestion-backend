import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CalendlyService } from './calendly.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { Buffer } from 'buffer';
import axios from 'axios';

export class CalendlyController  {
  calendlyService = new CalendlyService();


  redirectToCalendlyAuth = catchAsync(async (req: Request, res: Response) => {
    
    // Optional: Pass user ID in state for validation (base64 encoded)
    const state = Buffer.from(JSON.stringify({ 
      userId: req.user.userId, 
      timestamp: Date.now() 
    })).toString('base64');

    console.log("state :: ", state);
    
    const authUrl = this.calendlyService.getAuthUrl(state);

    console.log("authUrl :: ", authUrl)

    // res.redirect(authUrl);

    sendResponse(res, {
      code: StatusCodes.OK,
      data: authUrl,
      message: `url received successfully`,
      success: true,
    });
  });


  deleteWebhookSubscription = catchAsync(async (req: Request, res: Response) => {
    
    const tokenWithBearer = req.headers.authorization;
    let token;
    if (tokenWithBearer.startsWith('Bearer')) {
      token = tokenWithBearer.split(' ')[1];
    }

    console.log("token", token);

    let userDetails = await this.calendlyService.getUserDetails("eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzcxMjIzODIwLCJqdGkiOiIwYTJjOGI1OS1jNTczLTRlMmItOGVlMy0xYjg5NDk4NDM0ZDMiLCJ1c2VyX3V1aWQiOiJmYzQyNWFiZi04MzQ4LTRlMTQtYTAzMi0yMGM3YWFlMTI5YWEiLCJhcHBfdWlkIjoiVWZYWlI3YzMybXlSUmJmWnFhX21jNjh2emg2WWpvTkZOYlVoSHFoQ21QbyIsInNjb3BlIjoiZGVmYXVsdCIsImV4cCI6MTc3MTIzMTAyMH0.IEyf8ostzbmzDnKlgCKlgdDqBan-s0mRh-vcJp3Zrje_DZH7XWY_UbGQ1DQKGemi6zTEaq6Nx-aaImG6CouqAQ")
    
    console.log("userDetails :: ", userDetails);

    // const webhookId = webhookUri.split('/').pop();

    // await axios.delete(
    //   `https://api.calendly.com/webhook_subscriptions/fc425abf-8348-4e14-a032-20c7aae129aa`,
    //   {
    //     headers: {
    //       Authorization: `Bearer eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzcxMjIzODIwLCJqdGkiOiIwYTJjOGI1OS1jNTczLTRlMmItOGVlMy0xYjg5NDk4NDM0ZDMiLCJ1c2VyX3V1aWQiOiJmYzQyNWFiZi04MzQ4LTRlMTQtYTAzMi0yMGM3YWFlMTI5YWEiLCJhcHBfdWlkIjoiVWZYWlI3YzMybXlSUmJmWnFhX21jNjh2emg2WWpvTkZOYlVoSHFoQ21QbyIsInNjb3BlIjoiZGVmYXVsdCIsImV4cCI6MTc3MTIzMTAyMH0.IEyf8ostzbmzDnKlgCKlgdDqBan-s0mRh-vcJp3Zrje_DZH7XWY_UbGQ1DQKGemi6zTEaq6Nx-aaImG6CouqAQ`,
    //     },
    //   }
    // );


    sendResponse(res, {
      code: StatusCodes.OK,
      data: null,
      message: `account removed successfully`,
      success: true,
    });
  });


  disconnectCalendly = catchAsync(async (req: Request, res: Response) => {

    const userId = req.user.id;

    const { accessToken, organization } = req.query;

    // 2️⃣ delete webhooks FIRST
    await this.calendlyService.deleteAllWebhooks(accessToken, organization);

    sendResponse(res, {
      code: StatusCodes.OK,
      success: true,
      message: "Calendly disconnected successfully",
      data: null,
    });
  });

/*
  async disconnectCalendly(accessToken: string, webhookUri: string) {
  const webhookId = webhookUri.split('/').pop();

  await axios.delete(
    `https://api.calendly.com/webhook_subscriptions/${webhookId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

*/

  // add more methods here if needed or override the existing ones 
}
