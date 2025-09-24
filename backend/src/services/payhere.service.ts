import env from '../config/env.js';
import mongoose from 'mongoose';
import { PayHereUtils } from '../util/payhere.util.js';
import { createPaymentService, updatePaymentService } from './payment.services.js';
import Payment from '../models/payment.model.js';

export interface PayHerePaymentRequest {
    userId: string;
    amount: number;
    currency: string;
    type: 'membership' | 'inventory' | 'booking' | 'other';
    relatedId: string;
    description: string;
    customerFirstName: string;
    customerLastName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    customerCity: string;
}

export interface PayHerePaymentData {
    merchant_id: string;
    return_url: string;
    cancel_url: string;
    notify_url: string;
    order_id: string;
    items: string;
    currency: string;
    amount: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    hash: string;
}

export interface PayHereWebhookData {
    merchant_id: string;
    order_id: string;
    payhere_amount: string;
    payhere_currency: string;
    status_code: string;
    md5sig: string;
    custom_1?: string;
    custom_2?: string;
    method: string;
    status_message: string;
    card_holder_name?: string;
    card_no?: string;
    card_expiry?: string;
}

/**
 * PayHere Payment Gateway Service
 */
export class PayHereService {
    private static readonly PAYHERE_CHECKOUT_URL = 'https://sandbox.payhere.lk/pay/checkout'; // Use sandbox for testing
    private static readonly PRODUCTION_URL = 'https://www.payhere.lk/pay/checkout';

    /**
     * Initialize PayHere payment and create payment record
     */
    async initiatePayment(paymentRequest: PayHerePaymentRequest): Promise<{
        payment: any;
        paymentData: PayHerePaymentData;
        checkoutUrl: string;
    }> {
        try {
            // Generate unique order ID
            const orderId = PayHereUtils.generateOrderId('ZFIT');
            
            // Create payment record in database first
            const paymentData = {
                userId: new mongoose.Types.ObjectId(paymentRequest.userId),
                amount: paymentRequest.amount,
                currency: paymentRequest.currency,
                type: paymentRequest.type,
                status: 'pending' as const,
                method: 'card' as const,
                relatedId: new mongoose.Types.ObjectId(paymentRequest.relatedId),
                transactionId: orderId,
                date: new Date()
            };

            const payment = await createPaymentService(paymentData);

            // Prepare PayHere payment data
            const payhereData: PayHerePaymentData = {
                merchant_id: env.PAYHERE_MERCHANT_ID,
                return_url: `${env.APP_ORIGIN}/payment/success?order_id=${orderId}`,
                cancel_url: `${env.APP_ORIGIN}/payment/cancel?order_id=${orderId}`,
                notify_url: `${env.APP_ORIGIN}/api/v1/gateways/webhook/payhere`,
                order_id: orderId,
                items: paymentRequest.description,
                currency: paymentRequest.currency,
                amount: PayHereUtils.formatAmount(paymentRequest.amount),
                first_name: paymentRequest.customerFirstName,
                last_name: paymentRequest.customerLastName,
                email: paymentRequest.customerEmail,
                phone: paymentRequest.customerPhone,
                address: paymentRequest.customerAddress,
                city: paymentRequest.customerCity,
                country: 'Sri Lanka',
                hash: ''
            };

            // Generate hash for security
            payhereData.hash = PayHereUtils.generatePaymentHash({
                merchant_id: payhereData.merchant_id,
                order_id: payhereData.order_id,
                amount: payhereData.amount,
                currency: payhereData.currency,
                merchant_secret: env.PAYHERE_MERCHANT_SECRET
            });

            return {
                payment,
                paymentData: payhereData,
                checkoutUrl: env.NODE_ENV === 'production' 
                    ? PayHereService.PRODUCTION_URL 
                    : PayHereService.PAYHERE_CHECKOUT_URL
            };
        } catch (error) {
            throw new Error(`PayHere payment initiation failed: ${(error as Error).message}`);
        }
    }

    /**
     * Handle PayHere webhook notification
     */
    async handleWebhook(webhookData: PayHereWebhookData): Promise<{
        success: boolean;
        message: string;
        payment?: any;
    }> {
        try {
            // Verify webhook signature
            if (!PayHereUtils.verifyWebhook(webhookData)) {
                return {
                    success: false,
                    message: 'Invalid webhook signature'
                };
            }

            // Find payment by order ID
            const payment = await Payment.findOne({ 
                transactionId: webhookData.order_id 
            });

            if (!payment) {
                return {
                    success: false,
                    message: 'Payment not found'
                };
            }

            // Parse PayHere status
            const paymentStatus = PayHereUtils.parseStatusCode(webhookData.status_code);

            // Update payment record
            const updatedPayment = await updatePaymentService(payment._id as string, {
                status: paymentStatus,
                gatewayTransactionId: webhookData.order_id,
                gatewayPaymentId: webhookData.merchant_id,
                gatewayResponse: webhookData as any,
                ...(paymentStatus === 'failed' && {
                    failureReason: webhookData.status_message
                })
            });

            return {
                success: true,
                message: 'Webhook processed successfully',
                payment: updatedPayment
            };
        } catch (error) {
            return {
                success: false,
                message: `Webhook processing failed: ${(error as Error).message}`
            };
        }
    }

    /**
     * Get payment status from PayHere (if needed)
     */
    async getPaymentStatus(transactionId: string): Promise<{
        success: boolean;
        status?: string;
        message: string;
        payment?: any;
    }> {
        try {
            // Find payment in database
            const payment = await Payment.findOne({ 
                transactionId: transactionId 
            });

            if (!payment) {
                return {
                    success: false,
                    message: 'Payment not found'
                };
            }

            return {
                success: true,
                status: payment.status,
                message: 'Payment status retrieved successfully',
                payment
            };
        } catch (error) {
            return {
                success: false,
                message: `Failed to get payment status: ${(error as Error).message}`
            };
        }
    }

    /**
     * Process refund (if needed in future)
     */
    async processRefund(paymentId: string, amount: number, reason: string): Promise<any> {
        // PayHere doesn't have direct refund API
        // This would typically involve manual refund processing
        // For now, we'll update the payment status
        try {
            const payment = await updatePaymentService(paymentId, {
                status: 'refunded',
                refundedAmount: amount,
                refundReason: reason
            });

            return {
                success: true,
                message: 'Refund processed (manual verification required)',
                payment
            };
        } catch (error) {
            throw new Error(`Refund processing failed: ${(error as Error).message}`);
        }
    }
}