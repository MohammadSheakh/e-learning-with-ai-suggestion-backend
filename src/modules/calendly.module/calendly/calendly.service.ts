import { StatusCodes } from 'http-status-codes';
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
  async createWebhookSubscription(accessToken: string, userUri:string) {

    // TRIM EVERYTHING
    const webhookUrl = (process.env.CALENDLY_WEBHOOK_URL || '').trim();
    const cleanUserUri = (userUri || '').trim();
    const endpointUrl = 'https://api.calendly.com/webhook_subscriptions'.trim();

    
    const me = await axios.get(
        'https://api.calendly.com/users/me',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // const userUri = me.data.resource.uri;
      const organizationUri = me.data.resource.current_organization;


    let response;
    try{
         response = await axios.post(
        `https://api.calendly.com/webhook_subscriptions`.trim(),
        {
          url: webhookUrl,
          events: ['invitee.created', 'invitee.canceled'],
          //signing_key: process.env.CALENDLY_WEBHOOK_SIGNING_KEY,
          //organization: null, // User-level webhook
          scope: 'user',
          user : cleanUserUri,
          
          organization: organizationUri
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      // console.log("response from calendly.service.ts =>⚡⚡> ", response);
      
    }catch(error){
      console.error("Calendly ERROR DETAILS:", error?.response?.data);
      throw error;
    }
    
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


  //=============================  Delete Things  =====================

  // -----------------------------
  // GET ALL WEBHOOKS
  // -----------------------------
  async getWebhookSubscriptions(accessToken: string, organization: string) {
    const orgUrn = `https://api.calendly.com/organizations/${organization}`;


    const me = await axios.get(
        'https://api.calendly.com/users/me',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

    const userUri = me.data.resource.uri;


    const res = await axios.get(
      `https://api.calendly.com/webhook_subscriptions`,
      {
        params: {
          scope: 'user',
          organization: orgUrn, // e.g. https://api.calendly.com/organizations/XXX
          user: userUri,                 // e.g. https://api.calendly.com/users/XXX
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    console.log("Webhook Subscriptions :: ", res.data.collection);

    return res.data.collection || [];
  }

  // -----------------------------
  // DELETE SINGLE WEBHOOK
  // -----------------------------
  async deleteWebhook(accessToken: string, webhookUri: string) {
    const id = webhookUri.split("/").pop();

    if (!id) return;

    try {
      await axios.delete(
        `https://api.calendly.com/webhook_subscriptions/${id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    } catch (err: any) {
      // already deleted OR token expired
      if (err.response?.status !== 404 && err.response?.status !== 401) {
        throw err;
      }
    }
  }

  // -----------------------------
  // DELETE ALL WEBHOOKS
  // -----------------------------
  async deleteAllWebhooks(accessToken: string, organization: string) {
    const hooks = await this.getWebhookSubscriptions(accessToken, organization);

    console.log("hooks ", hooks);

    for (const hook of hooks) {
      await this.deleteWebhook(accessToken, hook.uri);
    }
  }
}
