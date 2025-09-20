import type { Request, Response } from 'express';
import PaymentMethod from '../models/payMethod.model.js';
//middleware

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        role?: string;
    };
}

// Added validation functions
const validateCreatePaymentMethod = (data: any): string | null => {
    if (!data.provider || !data.type) return 'Missing required fields: name and type';
    if (!['card', 'bank-transfer', 'cash'].includes(data.type)) return 'Invalid type';
    return null;
};

const validateUpdatePaymentMethod = (data: any): string | null => {
    if (data.type && !['card', 'bank-transfer', 'cash'].includes(data.type)) return 'Invalid type';
    return null;
};

export const createPaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const error = validateCreatePaymentMethod(req.body); 
        if (error) return res.status(400).json({ success: false, message: error });
        const method = new PaymentMethod({ ...req.body, userId: req.user.id });
        await method.save();
        res.status(201).json({ success: true, data: method });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const getPaymentMethods = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const methods = await PaymentMethod.find({ userId: req.user.id });
        res.json({ success: true, data: methods });
    } catch (error) {
        res.status(500).json({ success: false,  message: (error as Error).message });
    }
};

export const getPaymentMethodById = async (req: Request, res: Response) => {
    try {
        const method = await PaymentMethod.findById(req.params.id);
        if (!method) return res.status(404).json({ success: false, message: 'Payment method not found' });
        res.json({ success: true, data: method });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const updatePaymentMethod = async (req: Request, res: Response) => {
    try {
        const error = validateUpdatePaymentMethod(req.body); 
        if (error) return res.status(400).json({ success: false, message: error });
        const method = await PaymentMethod.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!method) return res.status(404).json({ success: false, message: 'Payment method not found' });
        res.json({ success: true, data: method });
    } catch (error) {
        res.status(400).json({ success: false,  message: (error as Error).message });
    }
};

export const deletePaymentMethod = async (req: Request, res: Response) => {
    try {
        const method = await PaymentMethod.findByIdAndDelete(req.params.id);
        if (!method) return res.status(404).json({ success: false, message: 'Payment method not found' });
        res.json({ success: true, message: 'Payment method deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};