import ApiError from "../../../errors/ApiError";
import { TRole } from "../../../middlewares/roles";
import { enqueueWebNotification } from "../../../services/notification.service";
import { TNotificationType } from "../../notification/notification.constants";
import { IUser } from "../../token/token.interface";
import { User } from "../../user.module/user/user.model";
import { WalletService } from "../../wallet.module/wallet/wallet.service";
import { TPaymentGateway, TPaymentStatus } from "../paymentTransaction/paymentTransaction.constant";
import { PaymentTransaction } from "../paymentTransaction/paymentTransaction.model";
//@ts-ignore
import Stripe from "stripe";
//@ts-ignore
import { StatusCodes } from 'http-status-codes';
//@ts-ignore
import mongoose from "mongoose";
import { PurchasedJourney } from "../../journey.module/purchasedJourney/purchasedJourney.model";
import { TTransactionFor } from "../../../constants/TTransactionFor";
import { IPurchasedJourney } from "../../journey.module/purchasedJourney/purchasedJourney.interface";
import { Capsule } from "../../journey.module/capsule/capsule.model";
import { ICapsule } from "../../journey.module/capsule/capsule.interface";
import { IStudentCapsuleTracker } from "../../journey.module/studentCapsuleTracker/studentCapsuleTracker.interface";
import { TCurrentSection, TTrackerStatus } from "../../journey.module/studentCapsuleTracker/studentCapsuleTracker.constant";
import { StudentCapsuleTracker } from "../../journey.module/studentCapsuleTracker/studentCapsuleTracker.model";


const walletService = new WalletService();

// Function for handling a successful payment
export const handlePaymentSucceeded = async (session: Stripe.Checkout.Session) => {
     
     try {

          console.log("session.metadata 🔎🔎", session.metadata)

          const { 
               referenceId, // bookingId
               user,
               referenceFor, // TTransactionFor .. bookingId related to which model
               currency,
               amount,
               referenceId2, // if more data is needed
               referenceFor2, // if more data is needed .. referenceId2 related to which model
               ...rest  // 👈 This captures everything else
          }: any = session.metadata;
          // userId // for sending notification .. 

          let _user:IUser = JSON.parse(user);

          const thisCustomer = await User.findOne({ _id: _user.userId });

          if (!thisCustomer) {
               throw new ApiError(StatusCodes.NOT_FOUND, 'Customer not found');
          }

          // TODO : 🟢🟢
          // Based on referenceId and referenceFor .. we need to check
          // that Id exist or not in our database .. 

          const paymentIntent = session.payment_intent as string;
          console.log('=============================');
          console.log('paymentIntent : ', paymentIntent);
          
          const isPaymentExist = await PaymentTransaction.findOne({ paymentIntent });

          if (isPaymentExist) {
               throw new ApiError(StatusCodes.BAD_REQUEST, 'From Webhook handler : Payment Already exist');
          }

          if(referenceFor === TTransactionFor.UserSubscription){

               // which means we dont create paymentTransaction here ..
               // we want to create  paymentTransaction in handleSuccessfulPayment
               console.log("🟡🟡 which means we dont create paymentTransaction here 🟡🟡 we want to create  paymentTransaction in handleSuccessfulPayment")
               // lets test ... 
               return
          }
          
          const newPayment = await PaymentTransaction.create({
               userId: _user.userId,
               referenceFor, // If this is for Order .. we pass "Order" here
               referenceId, // If this is for Order .. then we pass OrderId here
               paymentGateway: TPaymentGateway.stripe,
               transactionId: session.id,
               paymentIntent: paymentIntent,
               amount: amount,
               currency,
               paymentStatus: TPaymentStatus.completed,
               gatewayResponse: session,
          });

          let updatedObjectOfReferenceFor: any;
          if (referenceFor === TTransactionFor.PurchasedJourney) {
               
               updatedObjectOfReferenceFor = updatePurchasedJourney(
                    _user,
                    referenceId, // purchasedJourneyId
                    newPayment._id, 
                    referenceId2, // journeyId,
                    referenceFor2, // Journey Model Name 
               );

          }else{
               console.log(`🔎🔎🔎🔎🔎 May be we need to handle this  ${referenceFor} :: ${referenceId}`)
          }

          // if (!updatedObjectOfReferenceFor) {
          //      throw new ApiError(StatusCodes.NOT_FOUND, `In handlePaymentSucceeded Webhook Handler.. Booking not found 🚫 For '${referenceFor}': Id : ${referenceId}`);
          // }

          //---------------------------------
          // Notification Send korte hobe .. TODO :
          //---------------------------------

          return { payment: newPayment, paymentFor: updatedObjectOfReferenceFor };
     } catch (error) {
          console.error('Error in handlePaymentSucceeded:', error);
     }
};

//---------------------------------
// 🥇
//  const refModel = mongoose.model(result.type);
//  const isExistRefference = await refModel.findById(result.refferenceId).session(session);
//---------------------------------

async function updatePurchasedJourney(
     user: IUser,
     purchasedJourneyId: string,
     paymentTransactionId: string,
     journeyId : string,
     JourneyModelName : string,
){

     // isBookingExists = await Order.findOne({ _id: orderId });

     const updatedPurchasedJourney:IPurchasedJourney = await PurchasedJourney.findByIdAndUpdate(purchasedJourneyId, { 
          /* update fields */ 
          paymentTransactionId : paymentTransactionId,
          paymentStatus: TPaymentStatus.completed,
     }, { new: true });


     // Create all Student Capsule Tracker at purchase time 
     // get all capsules by purchasedJourneyId

     const capsules: ICapsule[] = await Capsule.find({
          journeyId : journeyId,
          isDeleted : false,
     }) 

     /*-─────────────────────────────────
     |  prepare StudentCapsuleTracker for bulk insert
     └──────────────────────────────────*/
     const studentCapsuleTrackers : IStudentCapsuleTracker[] = capsules.map((capsule : ICapsule) => ({
          capsuleNumber : capsule.capsuleNumber,
          title : capsule.title,
          capsuleId : capsule._id,
          studentId : user.userId,
          overallStatus : TTrackerStatus.notStarted,
          /*---------
          
               only introStatus inProgress e thakbe .. 
               baki gula notStarted e thakbe .. 

               jokhon e ek page theke arek page e jaowa hobe .. shei page er status 
               'notStarted' -> 'inProgress' e shift hoye jabe 

          -----------*/
          introStatus : TTrackerStatus.inProgress, // TTrackerStatus.notStarted
          inspirationStatus : TTrackerStatus.notStarted, // TTrackerStatus.notStarted
          diagnosticsStatus : TTrackerStatus.notStarted, // TTrackerStatus.notStarted
          scienceStatus : TTrackerStatus.notStarted, // TTrackerStatus.notStarted
          aiSummaryStatus : TTrackerStatus.notStarted, // TTrackerStatus.notStarted
          currentSection : TCurrentSection.introduction,
          progressPercentage : 0,
     }))

     console.log("studentCapsuleTrackers 🆕🆕 : ", studentCapsuleTrackers)

     const res = await StudentCapsuleTracker.insertMany(studentCapsuleTrackers);

     
     await enqueueWebNotification(
          `A Student ${user.userId} ${user.userName} purchased a journey, TxnId : ${paymentTransactionId}`,
          user.userId, // senderId
          null, // receiverId 
          TRole.admin, // receiverRole
          TNotificationType.payment, // type
          //---------------------------------
          // In UI there is a details page for order in admin end 
          //---------------------------------
          '', // linkFor // TODO : MUST add the query params 
          orderId, // linkId
          // TTransactionFor.TrainingProgramPurchase, // referenceFor
          // purchaseTrainingProgram._id // referenceId
     );

     return updatedPurchasedJourney;
}