import mongoose from 'mongoose';
import RecurringPayment from '../models/recurringPay.model.js';

interface RecurringPaymentData {
    userId?: string;
    membershipPlanId?: string;
    paymentMethodId?: string;
    amount?: number;
    frequency?: string;
    status?: string;
    startDate?: Date;
    nextPaymentDate?: Date;
}

export const createRecurringPaymentService = async (data: RecurringPaymentData) => {
    try {
        const recurringPayment = new RecurringPayment(data);
        return await recurringPayment.save();
    } catch (error) {
        throw new Error(`Failed to create recurring payment: ${(error as Error).message}`);
    }
};

export const getRecurringPaymentsService = async (userId?: string) => {
    try {
        const filter = userId ? { userId } : {};
        return await RecurringPayment.find(filter);
    } catch (error) {
        throw new Error(`Failed to fetch recurring payments: ${(error as Error).message}`);
    }
};

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
        throw new Error(`Failed to fetch recurring payment: ${(error as Error).message}`);
    }
};

export const updateRecurringPaymentService = async (id: string, data: RecurringPaymentData) => {
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

export const pauseRecurringPaymentService = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid recurring payment ID');
        }
        const recurringPayment = await RecurringPayment.findByIdAndUpdate(id, { status: 'paused' }, { new: true });
        if (!recurringPayment) {
            throw new Error('Recurring payment not found');
        }
        return recurringPayment;
    } catch (error) {
        throw new Error(`Failed to pause recurring payment: ${(error as Error).message}`);
    }
};

export const resumeRecurringPaymentService = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid recurring payment ID');
        }
        const recurringPayment = await RecurringPayment.findByIdAndUpdate(id, { status: 'active' }, { new: true });
        if (!recurringPayment) {
            throw new Error('Recurring payment not found');
        }
        return recurringPayment;
    } catch (error) {
        throw new Error(`Failed to resume recurring payment: ${(error as Error).message}`);
    }
};
