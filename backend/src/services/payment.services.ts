import Payment from "../models/payment.model.js";
import type { IPayment } from "../models/payment.model.js";

// Create a new payment
export const createPaymentService = async (data: Partial<IPayment>) => {
    const payment = new Payment(data);
    return await payment.save();
};

// Get all payments for a user
export const getPaymentsService = async (userId: string) => {
    return await Payment.find({ userId });
};

// Get single payment by ID
export const getPaymentByIdService = async (id: string) => {
    return await Payment.findById(id);
};

// Update payment
export const updatePaymentService = async (id: string, data: Partial<IPayment>) => {
    return await Payment.findByIdAndUpdate(id, data, { new: true });
};

// Delete payment
export const deletePaymentService = async (id: string) => {
    return await Payment.findByIdAndDelete(id);
};

// Process payment (mark as completed & store gateway response)
export const processPaymentService = async (id: string, response: any) => {
    return await Payment.findByIdAndUpdate(
        id,
        { status: "completed", gatewayResponse: response },
        { new: true }
    );
};
