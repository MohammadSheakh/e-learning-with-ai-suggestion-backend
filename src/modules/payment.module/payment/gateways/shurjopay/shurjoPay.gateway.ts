import { IServiceBooking } from "../../../../service.module/serviceBooking/serviceBooking.interface";
import { PaymentGateway } from "../../purchaseStrategy/purchaseStrategy.abstract";

export class ShurjoPayGateway implements PaymentGateway{
    processPayment(serviceBooking : IServiceBooking){

    }
}