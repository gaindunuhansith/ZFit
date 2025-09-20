import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
    createPaymentService,
    getPaymentsService,
    getPaymentByIdService,
    updatePaymentService,
    deletePaymentService,
    processPaymentService
} from '../services/payment.services.js';

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        role?: string;
    };
}

// Manual validation functions
const validateCreatePayment = (data: any): string | null => {
    if (!data.amount || !data.type || !data.status || !data.method || !data.relatedId || !data.transactionId || !data.date) {
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

        // For testing purposes, use a dummy userId if not provided
        const paymentData = { ...req.body };
        if (!paymentData.userId) {
            paymentData.userId = new mongoose.Types.ObjectId().toString(); // Dummy ObjectId as string
        }

        const payment = await createPaymentService(paymentData);
        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const getPayments = async (req: Request, res: Response) => {
    try {
        // For testing without auth, get all payments (normally would use userId from auth)
        const payments = await getPaymentsService(''); // Empty string to get all
        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getPaymentById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: 'Payment ID is required' });
        }
        const payment = await getPaymentByIdService(req.params.id);
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

        if (!req.params.id) {
            return res.status(400).json({ success: false, message: 'Payment ID is required' });
        }

        const payment = await updatePaymentService(req.params.id, req.body);
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.json({ success: true, data: payment });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const deletePayment = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: 'Payment ID is required' });
        }

        const payment = await deletePaymentService(req.params.id);
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.json({ success: true, message: 'Payment deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const processPayment = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: 'Payment ID is required' });
        }

        const payment = await processPaymentService(req.params.id, req.body.response);
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};