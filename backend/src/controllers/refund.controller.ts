import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import Refund from '../models/refund.model.js';
import {
    createRefundService,
    getRefundsService,
    getRefundByIdService,
    updateRefundService,
    deleteRefundService
} from '../services/refund.services.js';

// Zod schemas
const createRefundSchema = z.object({
    paymentId: z.string().min(1, 'Payment ID is required'),
    refundAmount: z.number().positive('Refund amount must be positive'),
    originalAmount: z.number().positive('Original amount must be positive'),
    reason: z.enum(['customer_request', 'duplicate', 'fraud', 'cancelled', 'error']),
    currency: z.string().default('USD'),
    status: z.enum(['pending', 'completed', 'failed']).optional().default('pending'),
    userId: z.string().optional() // Will be set from auth
});

const updateRefundSchema = z.object({
    refundAmount: z.number().positive('Refund amount must be positive').optional(),
    originalAmount: z.number().positive('Original amount must be positive').optional(),
    reason: z.enum(['customer_request', 'duplicate', 'fraud', 'cancelled', 'error']).optional(),
    currency: z.string().optional(),
    status: z.enum(['pending', 'completed', 'failed']).optional(),
    gatewayRefundId: z.string().optional(),
    gatewayResponse: z.any().optional()
}).refine((data) => {
    if (data.refundAmount && data.originalAmount && data.refundAmount > data.originalAmount) {
        return false;
    }
    return true;
}, {
    message: 'Refund amount cannot exceed original amount',
    path: ['refundAmount']
});

export const createRefund = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = createRefundSchema.parse(req.body);
        
        // Use authenticated user ID if available, otherwise allow manual specification
        const userId = (req as any).user?.id || validatedData.userId;
        const refundData = { ...validatedData, userId };
        
        const refund = await createRefundService(refundData);
        res.status(201).json({ success: true, data: refund });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, message: error.issues?.[0]?.message || 'Validation error' });
        }
        next(error);
    }
};

export const getRefunds = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Use authenticated user ID if available, otherwise get all refunds
        const userId = (req as any).user?.id;
        const refunds = await getRefundsService(userId);
        res.json({ success: true, data: refunds });
    } catch (error) {
        next(error);
    }
};

export const getRefundById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Refund ID is required' });
        const refund = await getRefundByIdService(req.params.id);
        res.json({ success: true, data: refund });
    } catch (error) {
        next(error);
    }
};


export const updateRefund = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Refund ID is required' });
        const validatedData = updateRefundSchema.parse(req.body);
        const refund = await updateRefundService(req.params.id, validatedData);
        res.json({ success: true, data: refund });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, message: error.issues?.[0]?.message || 'Validation error' });
        }
        next(error);
    }
};

export const deleteRefund = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Refund ID is required' });
        const refund = await deleteRefundService(req.params.id);
        res.json({ success: true, message: 'Refund deleted successfully' });
    } catch (error) {
        next(error);
    }
};