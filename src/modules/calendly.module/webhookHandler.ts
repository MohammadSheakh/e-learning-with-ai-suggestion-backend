//@ts-ignore
import { Request, Response } from 'express';
//@ts-ignore
import { StatusCodes } from 'http-status-codes';
import { CalendlyService } from './calendly/calendly.service';
import { User } from '../user.module/user/user.model';
import { encrypt } from '../../services/calendly.service';
import { handleInviteeCreated } from './webhookHandlers/handleInviteeCreated';
import { handleInviteeCanceled } from './webhookHandlers/handleMeetingCanceled';

const calendlyService = new CalendlyService();

export const calendlyOAuthCallbackHandler = async (req: Request, res: Response): Promise<void> => {
     try {
          const { code, state } = req.query;

          console.log("code .. state .. ", code, " -- ", state);
          
          // Validate state (prevent CSRF)
          if (!state) throw new Error('Invalid state parameter');
          const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
          
          // if (stateData.userId !== req.user.id) throw new Error('State mismatch');

          if (Date.now() - stateData.timestamp > 10 * 60 * 1000) throw new Error('State expired');
          
          // Exchange code for tokens
          const tokenData = await calendlyService.getAccessToken(code);

          console.log("tokenData :: ", tokenData);
          
          // Get user details for profile URL
          const userDetails = await calendlyService.getUserDetails(tokenData.access_token);
          

          console.log("userDetails :: ", userDetails);

          // Create webhook subscription
          const webhook = await calendlyService.createWebhookSubscription(tokenData.access_token);
          

          console.log("webhook :: ", webhook);

          // Update user record (ENCRYPT token before saving!)
          const updatedUser = await User.findByIdAndUpdate(
               req.user.id,
               {
                    $set: {
                         'calendly.userId': tokenData.calendly_user_uuid,
                         'calendly.organizationId': tokenData.organization_uuid,
                         'calendly.encryptedAccessToken': encrypt(tokenData.access_token),
                         'calendly.webhookSubscriptionId': webhook.id,
                         'calendly.profileUrl': userDetails.scheduling_url,
                         'calendly.connectedAt': new Date(),
                         'calendly.disconnectedAt': null,
                    }
               },
               { new: true, runValidators: true }
          );
          
          // Success redirect
          res.redirect(`/dashboard?calendly=connected&name=${encodeURIComponent(userDetails.name)}`);
     } catch (error) {
          console.error('Calendly OAuth error:', error);
          res.redirect(`/dashboard?calendly=error&message=${encodeURIComponent(error.message)}`);
     }
};

export const calendlyWebHookHandler = async (req: Request, res: Response): Promise<void> => {
     // ALWAYS return 200 to prevent Calendly retries
     res.status(200).json({ received: true });
     
     try {
          const { event, payload } = req.body;
          
          // Extract Calendly user UUID from event URI
          // Example: "https://api.calendly.com/users/abcd-1234-efgh" -> "abcd-1234-efgh"
          const calendlyUserId = payload.event.user.split('/').pop();
          
          // Find user by Calendly ID (critical routing step!)
          const user = await User.findOne({
               'calendly.userId': calendlyUserId,
               isDeleted: false,
               'calendly.disconnectedAt': null
          });
          
          if (!user) {
               console.warn(`⚠️ Webhook for unknown Calendly user: ${calendlyUserId}`);
               return;
          }
          
          // Process event based on type
          switch (event) {
               case 'invitee.created':
                    await handleInviteeCreated(user, payload);
                    break;
               
               case 'invitee.canceled':
                    await handleInviteeCanceled(payload);
                    break;
                    
               default:
                    console.log(`Unhandled Calendly event: ${event}`);
          }
     } catch (error) {
     console.error('Webhook processing error:', error);
     // DO NOT throw - we already sent 200 response
     }
};
