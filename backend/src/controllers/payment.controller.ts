import type { Request, Response } from 'express';
import Payment from '../models/payment.model.js';  // Fixed: Removed .js extension.

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        role?: string;
    };
}

// Manual validation functions
const validateCreatePayment = (data: any): string | null => {
    if (!data.userId || !data.amount || !data.type || !data.status || !data.method || !data.relatedId || !data.transactionId || !data.date) {
        return 'Missing required fields';
    }
    if (data.amount < 0) return 'Amount must be non-negative';
    if (!['membership', 'inventory', 'booking', 'other'].includes(data.type)) return 'Invalid type';
    if (!['pending', 'completed', 'failed', 'refunded'].includes(data.status)) return 'Invalid status';
    if (!['card', 'bank-transfer', 'cash'].includes(data.method)) return 'Invalid method';
    return null;
};

const validateUpdatePayment = (data: any): string | null => {
    if (data.amount !== undefined && data.amount < 0) return 'Amount must be non-negative';
    if (data.type && !['membership', 'inventory', 'booking', 'other'].includes(data.type)) return 'Invalid type';
    if (data.status && !['pending', 'completed', 'failed', 'refunded'].includes(data.status)) return 'Invalid status';
    if (data.method && !['card', 'bank-transfer', 'cash'].includes(data.method)) return 'Invalid method';
    return null;
};

export const createPayment = async (req: Request, res: Response) => {
    try {
        const error = validateCreatePayment(req.body);
        if (error) return res.status(400).json({ success: false, message: error });
        const payment = new Payment(req.body);
        await payment.save();
        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const getPayments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const payments = await Payment.find({ userId: req.user.id });
        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getPaymentById = async (req: Request, res: Response) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const updatePayment = async (req: Request, res: Response) => {
    try {
        const error = validateUpdatePayment(req.body);
        if (error) return res.status(400).json({ success: false, message: error });
        const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.json({ success: true, data: payment });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const deletePayment = async (req: Request, res: Response) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.json({ success: true, message: 'Payment deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const processPayment = async (req: Request, res: Response) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, { status: 'completed', gatewayResponse: req.body.response }, { new: true });
        res.json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};