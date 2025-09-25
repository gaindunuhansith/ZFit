import PaymentMethod from '../models/payMethod.model.js';
import type { IPaymentMethod } from '../models/payMethod.model.js';
import mongoose from 'mongoose';

// Create a new payment method
export const createPaymentMethodService = async (
    userId: string,
    data: Record<string, any>
): Promise<IPaymentMethod> => {
        const method = new PaymentMethod({ ...data, userId });
        return await method.save();

};

// Get all payment methods for a user
export const getPaymentMethodsService = async (
    userId: string
): Promise<IPaymentMethod[]> => {
        return await PaymentMethod.find({ userId });
};

// Get single payment method by ID
export const getPaymentMethodByIdService = async (
    id: string
): Promise<IPaymentMethod | null> => {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid payment method ID format');
        }
        return await PaymentMethod.findById(id);
   
    }
// Update payment method
export const updatePaymentMethodService = async (
    id: string,
    data: Record<string, any>
): Promise<IPaymentMethod | null> => {
   
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid payment method ID format');
        }
        return await PaymentMethod.findByIdAndUpdate(id, data, { new: true });

};

// Delete payment method
export const deletePaymentMethodService = async (
    id: string
): Promise<IPaymentMethod | null> => {
    
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid payment method ID format');
        }
        return await PaymentMethod.findByIdAndDelete(id);

};