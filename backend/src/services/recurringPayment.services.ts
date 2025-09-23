import RecurringPayment from "../models/recurringPayment.model.js";
import type { IRecurringPayment } from "../models/recurringPayment.model.js";
import mongoose from "mongoose";
import Payment from "../models/payment.model.js";
import payHereService from "./payhere.service.js";

// Create a new recurring payment
export const createRecurringPaymentService = async (data: Partial<IRecurringPayment>) => {
    try {
        const recurringPayment = new RecurringPayment(data);
        return await recurringPayment.save();
    } catch (error) {
        throw new Error(`Failed to create recurring payment: ${(error as Error).message}`);
    }
};

// Get all recurring payments for a user
export const getRecurringPaymentsService = async (userId?: string) => {
    try {
        let query = {};
        if (userId) {
            if (mongoose.Types.ObjectId.isValid(userId)) {
                query = { userId: new mongoose.Types.ObjectId(userId) };
            } else {
                return [];
            }
        }
        return await RecurringPayment.find(query)
            .populate('userId', 'name email')
            .populate('paymentMethodId', 'name type')
            .sort({ nextPaymentDate: 1 });
    } catch (error) {
        throw new Error(`Failed to get recurring payments: ${(error as Error).message}`);
    }
};

// Get single recurring payment by ID
export const getRecurringPaymentByIdService = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid recurring payment ID format');
        }
        return await RecurringPayment.findById(id)
            .populate('userId', 'name email')
            .populate('paymentMethodId', 'name type')
            .populate('lastPaymentId');
    } catch (error) {
        throw new Error(`Failed to get recurring payment: ${(error as Error).message}`);
    }
};

// Update recurring payment
export const updateRecurringPaymentService = async (id: string, data: Partial<IRecurringPayment>) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid recurring payment ID format');
        }
        return await RecurringPayment.findByIdAndUpdate(id, data, { new: true })
            .populate('userId', 'name email')
            .populate('paymentMethodId', 'name type');
    } catch (error) {
        throw new Error(`Failed to update recurring payment: ${(error as Error).message}`);
    }
};

// Delete recurring payment (soft delete by setting status to cancelled)
export const deleteRecurringPaymentService = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid recurring payment ID format');
        }
        return await RecurringPayment.findByIdAndUpdate(
            id,
            { status: 'cancelled' },
            { new: true }
        );
    } catch (error) {
        throw new Error(`Failed to delete recurring payment: ${(error as Error).message}`);
    }
};

// Pause recurring payment
export const pauseRecurringPaymentService = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid recurring payment ID format');
        }
        return await RecurringPayment.findByIdAndUpdate(
            id,
            { status: 'paused' },
            { new: true }
        );
    } catch (error) {
        throw new Error(`Failed to pause recurring payment: ${(error as Error).message}`);
    }
};

// Resume recurring payment
export const resumeRecurringPaymentService = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid recurring payment ID format');
        }
        return await RecurringPayment.findByIdAndUpdate(
            id,
            { status: 'active' },
            { new: true }
        );
    } catch (error) {
        throw new Error(`Failed to resume recurring payment: ${(error as Error).message}`);
    }
};

// Get recurring payments due for processing
export const getDueRecurringPaymentsService = async () => {
    try {
        const now = new Date();
        return await RecurringPayment.find({
            status: 'active',
            nextPaymentDate: { $lte: now }
        })
        .populate('userId', 'name email')
        .populate('paymentMethodId')
        .sort({ nextPaymentDate: 1 });
    } catch (error) {
        throw new Error(`Failed to get due recurring payments: ${(error as Error).message}`);
    }
};

// Process a recurring payment using PayHere
export const processRecurringPaymentService = async (recurringPaymentId: string) => {
    let recurringPayment = null;

    try {
        if (!mongoose.Types.ObjectId.isValid(recurringPaymentId)) {
            throw new Error('Invalid recurring payment ID format');
        }

        recurringPayment = await RecurringPayment.findById(recurringPaymentId);
        if (!recurringPayment) {
            throw new Error('Recurring payment not found');
        }

        if (recurringPayment.status !== 'active') {
            throw new Error('Recurring payment is not active');
        }

        // Check if payment is due
        const now = new Date();
        if (recurringPayment.nextPaymentDate > now) {
            throw new Error('Recurring payment is not due yet');
        }

        // Check if max failures exceeded
        if (recurringPayment.failureCount >= recurringPayment.maxFailures) {
            await RecurringPayment.findByIdAndUpdate(recurringPaymentId, {
                status: 'cancelled'
            });
            throw new Error('Recurring payment cancelled due to maximum failures exceeded');
        }

        // Check if payment token exists
        if (!recurringPayment.paymentToken) {
            throw new Error('No payment token available for recurring payment');
        }

        // Process payment with PayHere
        const payHereResult = await payHereService.processRecurringPayment({
            token: recurringPayment.paymentToken,
            amount: recurringPayment.amount,
            currency: recurringPayment.currency,
            orderId: `RP_${recurringPaymentId}_${Date.now()}`
        });

        // Create payment record
        const paymentData = {
            userId: recurringPayment.userId,
            amount: recurringPayment.amount,
            currency: recurringPayment.currency,
            type: recurringPayment.relatedType,
            status: 'pending', // Will be updated by webhook
            method: 'card',
            relatedId: recurringPayment.relatedId,
            transactionId: payHereResult.order_id,
            refundedAmount: 0,
            date: new Date()
        };

        const payment = new Payment(paymentData);
        const savedPayment = await payment.save();

        // Update recurring payment
        const nextPaymentDate = calculateNextPaymentDate(recurringPayment.nextPaymentDate, recurringPayment.frequency);

        await RecurringPayment.findByIdAndUpdate(recurringPaymentId, {
            lastPaymentDate: new Date(),
            lastPaymentId: savedPayment._id,
            nextPaymentDate: nextPaymentDate,
            failureCount: 0 // Reset on successful initiation
        });

        return { recurringPayment, payment: savedPayment };
    } catch (error) {
        // Increment failure count if we have a valid recurring payment
        if (recurringPayment && recurringPayment._id) {
            try {
                await RecurringPayment.findByIdAndUpdate(recurringPayment._id, {
                    $inc: { failureCount: 1 }
                });
            } catch (updateError) {
                console.error('Failed to update failure count:', updateError);
            }
        }

        throw new Error(`Failed to process recurring payment: ${(error as Error).message}`);
    }
};

// Helper function to calculate next payment date
const calculateNextPaymentDate = (currentDate: Date, frequency: string): Date => {
    const date = new Date(currentDate.getTime()); // Create a copy to avoid modifying original

    switch (frequency) {
        case 'weekly':
            date.setDate(date.getDate() + 7);
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'quarterly':
            date.setMonth(date.getMonth() + 3);
            break;
        case 'yearly':
            date.setFullYear(date.getFullYear() + 1);
            break;
        default:
            date.setMonth(date.getMonth() + 1);
    }

    return date;
};

// Get recurring payments by related entity
export const getRecurringPaymentsByRelatedService = async (relatedId: string, relatedType: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(relatedId)) {
            throw new Error('Invalid related ID format');
        }

        return await RecurringPayment.find({
            relatedId: new mongoose.Types.ObjectId(relatedId),
            relatedType,
            status: { $ne: 'cancelled' }
        })
        .populate('userId', 'name email')
        .populate('paymentMethodId', 'name type');
    } catch (error) {
        throw new Error(`Failed to get recurring payments by related: ${(error as Error).message}`);
    }
};