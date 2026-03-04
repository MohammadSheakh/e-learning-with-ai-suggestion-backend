import { TTransactionFor } from "../../../constants/TTransactionFor";
import { TCurrency } from "../../../enums/payment";
import { PurchaseStrategy } from "../../payment.module/payment/purchaseStrategy/purchaseStrategy.abstract";
import { TPaymentStatus } from "../../payment.module/paymentTransaction/paymentTransaction.constant";
import { IUser } from "../../token/token.interface";
import { IAdminCapsule } from "../adminCapsule/adminCapsule.interface";
import { AdminCapsule } from "../adminCapsule/adminCapsule.model";
import { PurchasedAdminCapsule } from "./purchasedAdminCapsule.model";

// AdminCapsule — only the differences
class AdminCapsulePurchaseStrategy extends PurchaseStrategy<IAdminCapsule> {

    async checkAlreadyPurchased(capsuleId: string, userId: string) {
        return !!await PurchasedAdminCapsule.findOne({ 
        capsuleId, studentId: userId,
        paymentStatus: TPaymentStatus.completed 
        });
    }

    async findExisting(capsuleId: string) {
        return AdminCapsule.findById(capsuleId);
    }

    async createPendingPurchase(capsule: IAdminCapsule, user: IUser, session: any) {
        const result = await PurchasedAdminCapsule.create([{
        studentId: user.userId,
        capsuleId: capsule._id,
        paymentStatus: TPaymentStatus.pending,
        price: parseInt(capsule.price),
        totalModules: capsule.totalModule,
        isGifted: false,
        paymentTransactionId: null,
        }], { session });
        return result[0];
    }

    getMetadata(purchase: any, capsule: IAdminCapsule, user: IUser) {
        return {
        referenceId: purchase._id.toString(),
        referenceFor: TTransactionFor.PurchasedAdminCapsule,
        referenceId2: capsule._id.toString(),
        referenceFor2: 'AdminCapsule',
        amount: purchase.price.toString(),
        currency: TCurrency.usd,
        user: JSON.stringify(user),
        };
    }
}