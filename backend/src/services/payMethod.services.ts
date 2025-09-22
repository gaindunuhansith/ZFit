import PaymentMethod from '../models/payMethod.model.js';
import type { IPaymentMethod } from '../models/payMethod.model.js';
import mongoose from 'mongoose';

// Create a new payment method
export const createPaymentMethodService = async (
    userId: string,
    data: Partial<IPaymentMethod>
): Promise<IPaymentMethod> => {
    try {
        const method = new PaymentMethod({ ...data, userId });
        return await method.save();
    } catch (error) {
        throw new Error(`Failed to create payment method: ${(error as Error).message}`);
    }
};

// Get all payment methods for a user
export const getPaymentMethodsService = async (
    userId: string
): Promise<IPaymentMethod[]> => {
    try {
        // If no userId provided (for testing), return all payment methods
        if (!userId) {
            return await PaymentMethod.find({});
        }
        return await PaymentMethod.find({ userId });
    } catch (error) {
        throw new Error(`Failed to get payment methods: ${(error as Error).message}`);
    }
};

// Get single payment method by ID
export const getPaymentMethodByIdService = async (
    id: string
): Promise<IPaymentMethod | null> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid payment method ID format');
        }
        return await PaymentMethod.findById(id);
    } catch (error) {
        throw new Error(`Failed to get payment method: ${(error as Error).message}`);
    }
};

// Update payment method
export const updatePaymentMethodService = async (
    id: string,
    data: Partial<IPaymentMethod>
): Promise<IPaymentMethod | null> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid payment method ID format');
        }
        return await PaymentMethod.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        throw new Error(`Failed to update payment method: ${(error as Error).message}`);
    }
};

// Delete payment method
export const deletePaymentMethodService = async (
    id: string
): Promise<IPaymentMethod | null> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid payment method ID format');
        }
        return await PaymentMethod.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(`Failed to delete payment method: ${(error as Error).message}`);
    }
};