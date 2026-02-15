import { StatusCodes } from 'http-status-codes';
import { GenericService } from '../../_generic-module/generic.services';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class CalendlyService{
  
  const CALENDLY_API = 'https://api.calendly.com';

  // Get OAuth authorization URL
  getAuthUrl(state = '') {
    const params = new URLSearchParams({
      client_id: process.env.CALENDLY_CLIENT_ID,
      redirect_uri: process.env.CALENDLY_REDIRECT_URI,
      state,
      response_type: 'code'
    });
    return `https://auth.calendly.com/oauth/authorize?${params.toString()}`;
  }

  // Exchange code for tokens
  async getAccessToken(code: string) {
    const response = await axios.post('https://auth.calendly.com/oauth/token', {
      grant_type: 'authorization_code',
      code,
      client_id: process.env.CALENDLY_CLIENT_ID,
      client_secret: process.env.CALENDLY_CLIENT_SECRET,
      redirect_uri: process.env.CALENDLY_REDIRECT_URI
    });
    
    return response.data; // { access_token, token_type, expires_in, refresh_token?, scope, calendly_user_uuid, organization_uuid }
  }

  // Create webhook subscription
  async createWebhookSubscription(accessToken: string) {
    const response = await axios.post(
      `${this.CALENDLY_API}/webhook_subscriptions`,
      {
        url: process.env.CALENDLY_WEBHOOK_URL,
        events: ['invitee.created', 'invitee.canceled'],
        signing_key: process.env.CALENDLY_WEBHOOK_SIGNING_KEY,
        organization: null, // User-level webhook
        scope: 'user'
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    
    return response.data.resource; // { uri, id, ... }
  }

  // Delete webhook subscription
  async deleteWebhookSubscription(webhookId: string, accessToken: string) {
    await axios.delete(
      `${this.CALENDLY_API}/webhook_subscriptions/${webhookId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  }

  // Get user details (for profile URL)
  async getUserDetails(accessToken: string) {
    const response = await axios.get(
      `${this.CALENDLY_API}/users/me`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data.resource;
  }
}
