import Payment from "../models/payment.model.js";
import type { IPayment } from "../models/payment.model.js";
import mongoose from "mongoose";

// Create a new payment
export const createPaymentService = async (data: Partial<IPayment>) => {
    const payment = new Payment(data);
    return await payment.save();
};

// Get all payments for a user
export const getPaymentsService = async (userId: string) => {
    if (!userId) {
        return await Payment.find({}).populate('userId', 'name email contactNo role status');
    }
    return await Payment.find({ userId }).populate('userId', 'name email contactNo role status');
};

// Get single payment by ID
export const getPaymentByIdService = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid payment ID format');
    }
    return await Payment.findById(id).populate('userId', 'name email contactNo role status');
};

// Update payment
export const updatePaymentService = async (id: string, data: Partial<IPayment>) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid payment ID format');
    }
    return await Payment.findByIdAndUpdate(id, data, { new: true }).populate('userId', 'name email contactNo role status');
};

// Delete payment
export const deletePaymentService = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid payment ID format');
    }
    return await Payment.findByIdAndDelete(id);
};

// Process payment (mark as completed & store gateway response)
export const processPaymentService = async (id: string, response: Record<string, unknown>) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid payment ID format');
    }
    return await Payment.findByIdAndUpdate(
        id,
        { status: "completed", gatewayResponse: response },
        { new: true }
    ).populate('userId', 'name email contactNo role status');
};
