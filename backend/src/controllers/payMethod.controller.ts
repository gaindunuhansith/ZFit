import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
    createPaymentMethodService,
    getPaymentMethodsService,
    getPaymentMethodByIdService,
    updatePaymentMethodService,
    deletePaymentMethodService
} from '../services/payMethod.services.js';

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        role?: string;
    };
}

// Added validation functions
const validateCreatePaymentMethod = (data: any): string | null => {
    if (!data.provider || !data.type) return 'Missing required fields: provider and type';
    if (!['card', 'bank-transfer', 'cash'].includes(data.type)) return 'Invalid type';
    return null;
};

const validateUpdatePaymentMethod = (data: any): string | null => {
    if (data.type && !['card', 'bank-transfer', 'cash'].includes(data.type)) return 'Invalid type';
    return null;
};

export const createPaymentMethod = async (req: Request, res: Response) => {
    try {
        const error = validateCreatePaymentMethod(req.body);
        if (error) return res.status(400).json({ success: false, message: error });

        // For testing purposes, use a dummy userId if not provided
        const methodData = { ...req.body };
        if (!methodData.userId) {
            methodData.userId = new mongoose.Types.ObjectId().toString(); // Dummy ObjectId as string
        }

        const method = await createPaymentMethodService(methodData.userId, methodData);
        res.status(201).json({ success: true, data: method });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const getPaymentMethods = async (req: Request, res: Response) => {
    try {
        // For testing without auth, get all payment methods (normally would use userId from auth)
        const methods = await getPaymentMethodsService(''); // Empty string to get all
        res.json({ success: true, data: methods });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getPaymentMethodById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: 'Payment method ID is required' });
        }
        const method = await getPaymentMethodByIdService(req.params.id);
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

        if (!req.params.id) {
            return res.status(400).json({ success: false, message: 'Payment method ID is required' });
        }

        const method = await updatePaymentMethodService(req.params.id, req.body);
        if (!method) return res.status(404).json({ success: false, message: 'Payment method not found' });
        res.json({ success: true, data: method });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const deletePaymentMethod = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: 'Payment method ID is required' });
        }

        const method = await deletePaymentMethodService(req.params.id);
        if (!method) return res.status(404).json({ success: false, message: 'Payment method not found' });
        res.json({ success: true, message: 'Payment method deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};