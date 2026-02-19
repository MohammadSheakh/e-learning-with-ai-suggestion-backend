//@ts-ignore
import { StatusCodes } from 'http-status-codes';
import { OAuthAccount } from './oauthAccount.model';
import { IOAuthAccount, OAuthPayload } from './oauthAccount.interface';
import { GenericService } from '../../_generic-module/generic.services';
import { OAuth2Client } from 'google-auth-library';
import appleSignin from 'apple-signin-auth';

export class OAuthAccountService extends GenericService<
  typeof OAuthAccount,
  IOAuthAccount
> {
  constructor() {
    super(OAuthAccount);
  }

  private static googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async verifyGoogleToken(idToken: string): Promise<OAuthPayload> {
    const ticket = await OAuthAccountService.googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const p = ticket.getPayload()!;

    console.log("p ======> 🆕🆕", p)
    // { sub: providerId, email, email_verified: isEmailVerified }

    return { provider: 'google', providerId: p.sub, email: p.email!, name: p.name, picture: p.picture };
  };

  async verifyAppleToken (identityToken: string): Promise<OAuthPayload> {
    const p = await appleSignin.verifyIdToken(identityToken, {
      audience: process.env.APPLE_CLIENT_ID,
      ignoreExpiration: false,
    });
    return { provider: 'apple', providerId: p.sub, email: p.email!, name: p.name };
  };
}
