import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import {
    createPaymentMethodService,
    getPaymentMethodsService,
    getPaymentMethodByIdService,
    updatePaymentMethodService,
    deletePaymentMethodService
} from '../services/payMethod.services.js';


// Zod validation schemas
const createPaymentMethodSchema = z.object({
    type: z.enum(['card', 'bank-transfer', 'cash']),
    provider: z.string().min(1, 'Provider is required'),
    maskedNumber: z.string().optional(),
    expiryMonth: z.string().optional(),
    expiryYear: z.string().optional(),
    gatewayToken: z.string().optional(),
    isDefault: z.boolean().optional(),
    isActive: z.boolean().optional()
});

const updatePaymentMethodSchema = z.object({
    type: z.enum(['card', 'bank-transfer', 'cash']).optional(),
    provider: z.string().min(1).optional(),
    maskedNumber: z.string().optional(),
    expiryMonth: z.string().optional(),
    expiryYear: z.string().optional(),
    gatewayToken: z.string().optional(),
    isDefault: z.boolean().optional(),
    isActive: z.boolean().optional()
});

export const createPaymentMethod = async (req: Request, res: Response,next: NextFunction) => {
    try {
        const validated = createPaymentMethodSchema.parse(req.body);

        const methodData = { 
            ...validated,
            userId: (req as any).userId // From auth middleware
        };

        const method = await createPaymentMethodService((req as any).userId, validated);
        res.status(201).json({ success: true, data: method });
    } catch (error) {
        next(error);
    }
};

export const getPaymentMethods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const methods = await getPaymentMethodsService((req as any).userId);
        res.json({ success: true, data: methods });
    } catch (error) {
        next(error);
    }
};

export const getPaymentMethodById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: 'Payment method ID is required' });
        }
        const method = await getPaymentMethodByIdService(req.params.id);
        if (!method) return res.status(404).json({ success: false, message: 'Payment method not found' });
        res.json({ success: true, data: method });
    } catch (error) {
        next(error);
    }
};

export const updatePaymentMethod = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validated = updatePaymentMethodSchema.parse(req.body);

        if (!req.params.id) {
            return res.status(400).json({ success: false, message: 'Payment method ID is required' });
        }

        // Filter out undefined values to comply with exactOptionalPropertyTypes
        const updateData = Object.fromEntries(
            Object.entries(validated).filter(([, value]) => value !== undefined)
        );

        const method = await updatePaymentMethodService(req.params.id, updateData);
        if (!method) return res.status(404).json({ success: false, message: 'Payment method not found' });
        res.json({ success: true, data: method });
    } catch (error) {
        next(error);
    }
};

export const deletePaymentMethod = async (req: Request, res: Response,next: NextFunction) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: 'Payment method ID is required' });
        }

        const method = await deletePaymentMethodService(req.params.id);
        if (!method) return res.status(404).json({ success: false, message: 'Payment method not found' });
        res.json({ success: true, message: 'Payment method deleted' });
    } catch (error) {
       next(error);
    }
};