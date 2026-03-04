//01968138704
//1020

import { PurchasedAdminCapsule } from "../../adminCapsule.module/purchasedAdminCapsule/purchasedAdminCapsule.model";
import { PurchasedJourney } from "../../journey.module/purchasedJourney/purchasedJourney.model";
import { StripeGateway } from "./gateways/stripe/stripe.gateway";
import { PaymentService } from "./payment.service";

/*-─────────────────────────────────
|  We need to import this module at app.ts
└──────────────────────────────────*/

const paymentService = new PaymentService();

paymentService.registerStrategy('Capsule', new PurchasedAdminCapsule());
paymentService.registerStrategy('Journey', new PurchasedJourney());

paymentService.registerGateway('stripe', new StripeGateway());

export { paymentService }