import RecurringPayment from "../models/recurringPay.model.js";
import type { IRecurringPayment } from "../models/recurringPay.model.js";
import mongoose from "mongoose";

// Create a new recurring payment
export const createRecurringPaymentService = async (data: Partial<IRecurringPayment>) => {
    try {
        // Generate subscription ID if not provided
        if (!data.subscriptionId) {
            const count = await RecurringPayment.countDocuments();
            data.subscriptionId = `ZF-SUB-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
        }

        const recurringPayment = new RecurringPayment(data);
        return await recurringPayment.save();
    } catch (error) {
        throw new Error(`Failed to create recurring payment: ${(error as Error).message}`);
    }
};

// Get all recurring payments for a user
export const getRecurringPaymentsService = async (userId?: string) => {
    try {
        const filter = userId ? { userId } : {};
        return await RecurringPayment.find(filter);
    } catch (error) {
        throw new Error(`Failed to get recurring payments: ${(error as Error).message}`);
    }
};

// Get single recurring payment by ID
export const getRecurringPaymentByIdService = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid recurring payment ID');
        }
        const recurringPayment = await RecurringPayment.findById(id);
        if (!recurringPayment) {
            throw new Error('Recurring payment not found');
        }
        return recurringPayment;
    } catch (error) {
        throw new Error(`Failed to get recurring payment: ${(error as Error).message}`);
    }
};

// Update recurring payment
export const updateRecurringPaymentService = async (id: string, data: Partial<IRecurringPayment>) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid recurring payment ID');
        }
        const recurringPayment = await RecurringPayment.findByIdAndUpdate(id, data, { new: true });
        if (!recurringPayment) {
            throw new Error('Recurring payment not found');
        }
        return recurringPayment;
    } catch (error) {
        throw new Error(`Failed to update recurring payment: ${(error as Error).message}`);
    }
};

// Delete recurring payment
export const deleteRecurringPaymentService = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid recurring payment ID');
        }
        const recurringPayment = await RecurringPayment.findByIdAndDelete(id);
        if (!recurringPayment) {
            throw new Error('Recurring payment not found');
        }
        return recurringPayment;
    } catch (error) {
        throw new Error(`Failed to delete recurring payment: ${(error as Error).message}`);
    }
};

// Pause recurring payment
export const pauseRecurringPaymentService = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid recurring payment ID');
        }
        const recurringPayment = await RecurringPayment.findByIdAndUpdate(
            id,
            { status: 'paused', isActive: false },
            { new: true }
        );
        if (!recurringPayment) {
            throw new Error('Recurring payment not found');
        }
        return recurringPayment;
    } catch (error) {
        throw new Error(`Failed to pause recurring payment: ${(error as Error).message}`);
    }
};

// Resume recurring payment
export const resumeRecurringPaymentService = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid recurring payment ID');
        }
        const recurringPayment = await RecurringPayment.findByIdAndUpdate(
            id,
            { status: 'active', isActive: true },
            { new: true }
        );
        if (!recurringPayment) {
            throw new Error('Recurring payment not found');
        }
        return recurringPayment;
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
            isActive: true,
            nextPaymentDate: { $lte: now }
        });
    } catch (error) {
        throw new Error(`Failed to get due recurring payments: ${(error as Error).message}`);
    }
};

// Update payment statistics after successful payment
export const updatePaymentStatsService = async (id: string, amount: number, success: boolean) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid recurring payment ID');
        }

        const updateData: Record<string, number | Date | object> = {
            lastPaymentDate: new Date(),
            lastPaymentAmount: amount,
        };

        if (success) {
            updateData.$inc = { totalPayments: 1, successfulPayments: 1 };
            updateData.retryCount = 0; // Reset retry count on success
        } else {
            updateData.$inc = { totalPayments: 1, failedPayments: 1, retryCount: 1 };
        }

        const recurringPayment = await RecurringPayment.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!recurringPayment) {
            throw new Error('Recurring payment not found');
        }

        return recurringPayment;
    } catch (error) {
        throw new Error(`Failed to update payment stats: ${(error as Error).message}`);
    }
};

// Cancel recurring payment
export const cancelRecurringPaymentService = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid recurring payment ID');
        }
        const recurringPayment = await RecurringPayment.findByIdAndUpdate(
            id,
            { status: 'cancelled', isActive: false },
            { new: true }
        );
        if (!recurringPayment) {
            throw new Error('Recurring payment not found');
        }
        return recurringPayment;
    } catch (error) {
        throw new Error(`Failed to cancel recurring payment: ${(error as Error).message}`);
    }
};