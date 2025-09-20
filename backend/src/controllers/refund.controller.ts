import type { Request, Response } from 'express';
import Refund from '../models/refund.model.js';
import {
    createRefundService,
    getRefundsService,
    getRefundByIdService,
    updateRefundService,
    deleteRefundService
} from '../services/refund.services.js';

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        role?: string;
    };
}

// Added validation functions (adjust based on your Refund model fields)
const validateCreateRefund = (data: any): string | null => {
    if (!data.refundAmount || !data.originalAmount || !data.reason || !data.paymentId) return 'Missing required fields: refundAmount, originalAmount, reason, and paymentId';
    if (data.refundAmount <= 0) return 'Refund amount must be positive';
    if (data.originalAmount <= 0) return 'Original amount must be positive';
    if (data.refundAmount > data.originalAmount) return 'Refund amount cannot exceed original amount';
    if (data.status && !['pending', 'completed', 'failed'].includes(data.status)) return 'Invalid status - must be pending, completed, or failed';
    return null;
};

const validateUpdateRefund = (data: any): string | null => {
    if (data.refundAmount !== undefined && data.refundAmount <= 0) return 'Refund amount must be positive';
    if (data.originalAmount !== undefined && data.originalAmount <= 0) return 'Original amount must be positive';
    if (data.refundAmount && data.originalAmount && data.refundAmount > data.originalAmount) return 'Refund amount cannot exceed original amount';
    if (data.status && !['pending', 'completed', 'failed'].includes(data.status)) return 'Invalid status - must be pending, completed, or failed';
    return null;
};

export const createRefund = async (req: Request, res: Response) => {
    try {
        const error = validateCreateRefund(req.body);
        if (error) return res.status(400).json({ success: false, message: error });
        
        // Use authenticated user ID if available, otherwise allow manual specification
        const userId = (req as any).user?.id || req.body.userId;
        const refundData = { ...req.body, userId };
        
        const refund = await createRefundService(refundData);
        res.status(201).json({ success: true, data: refund });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const getRefunds = async (req: Request, res: Response) => {
    try {
        // Use authenticated user ID if available, otherwise get all refunds
        const userId = (req as any).user?.id;
        const refunds = await getRefundsService(userId);
        res.json({ success: true, data: refunds });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getRefundById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Refund ID is required' });
        const refund = await getRefundByIdService(req.params.id);
        res.json({ success: true, data: refund });
    } catch (error) {
        res.status(404).json({ success: false, message: (error as Error).message });
    }
};

export const updateRefund = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Refund ID is required' });
        const error = validateUpdateRefund(req.body);
        if (error) return res.status(400).json({ success: false, message: error });
        const refund = await updateRefundService(req.params.id, req.body);
        res.json({ success: true, data: refund });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const deleteRefund = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Refund ID is required' });
        const refund = await deleteRefundService(req.params.id);
        res.json({ success: true, message: 'Refund deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};