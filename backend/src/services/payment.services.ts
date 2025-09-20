import Payment from "../models/payment.model.js";
import type { IPayment } from "../models/payment.model.js";
import mongoose from "mongoose";

// Create a new payment
export const createPaymentService = async (data: Partial<IPayment>) => {
    try {
        const payment = new Payment(data);
        return await payment.save();
    } catch (error) {
        throw new Error(`Failed to create payment: ${(error as Error).message}`);
    }
};

// Get all payments for a user
export const getPaymentsService = async (userId: string) => {
    try {
        // If no userId provided (for testing), return all payments
        if (!userId) {
            return await Payment.find({});
        }
        return await Payment.find({ userId });
    } catch (error) {
        throw new Error(`Failed to get payments: ${(error as Error).message}`);
    }
};

// Get single payment by ID
export const getPaymentByIdService = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid payment ID format');
        }
        return await Payment.findById(id);
    } catch (error) {
        throw new Error(`Failed to get payment: ${(error as Error).message}`);
    }
};

// Update payment
export const updatePaymentService = async (id: string, data: Partial<IPayment>) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid payment ID format');
        }
        return await Payment.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        throw new Error(`Failed to update payment: ${(error as Error).message}`);
    }
};

// Delete payment
export const deletePaymentService = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid payment ID format');
        }
        return await Payment.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(`Failed to delete payment: ${(error as Error).message}`);
    }
};

// Process payment (mark as completed & store gateway response)
export const processPaymentService = async (id: string, response: any) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid payment ID format');
        }
        return await Payment.findByIdAndUpdate(
            id,
            { status: "completed", gatewayResponse: response },
            { new: true }
        );
    } catch (error) {
        throw new Error(`Failed to process payment: ${(error as Error).message}`);
    }
};
