import ApiError from "../../../errors/ApiError";
import { TPaymentGateway } from "./payment.constant";
import { PaymentGateway } from "./purchaseStrategy/purchaseStrategy.abstract";
import { StatusCodes } from 'http-status-codes';
// https://www.youtube.com/watch?v=vE74gnv4VlY
export class PaymentService {

    private paymentGateways: Record<string, PaymentGateway> = {};

    public registerPaymentGateway(
        paymentMethod: TPaymentGateway,
        gateway: PaymentGateway
    ){
        this.paymentGateways[paymentMethod] = gateway;
    }

    public async processPayment(
        serviceBooking : IServiceBooking, 
        paymentMethod: TPaymentGateway
    ){
        const gateway = this.paymentGateways[paymentMethod]
        if(gateway){
            await gateway.processPayment(serviceBooking);
        }else{
            throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found.');
        }
    }
}