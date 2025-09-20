import type { Request, Response } from 'express';
import Refund from '../models/refund.model.js';
//middleware

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        role?: string;
    };
}

// Added validation functions (adjust based on your Refund model fields)
const validateCreateRefund = (data: any): string | null => {
    if (!data.amount || !data.reason || !data.paymentId) return 'Missing required fields: amount, reason, and paymentId';
    if (data.amount <= 0) return 'Amount must be positive';
    if (!['pending', 'approved', 'rejected', 'completed'].includes(data.status)) return 'Invalid status';  // Adjust enum as per model.
    return null;
};

const validateUpdateRefund = (data: any): string | null => {
    if (data.amount !== undefined && data.amount <= 0) return 'Amount must be positive';
    if (data.status && !['pending', 'approved', 'rejected', 'completed'].includes(data.status)) return 'Invalid status';
    return null;
};

export const createRefund = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const error = validateCreateRefund(req.body);
        if (error) return res.status(400).json({ success: false, message: error });
        const refund = new Refund({ ...req.body, userId: req.user.id });  
        await refund.save();
        res.status(201).json({ success: true, data: refund });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const getRefunds = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const refunds = await Refund.find({ userId: req.user.id });
        res.json({ success: true, data: refunds });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getRefundById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Refund ID is required' });
        const refund = await Refund.findById(req.params.id);
        if (!refund) return res.status(404).json({ success: false, message: 'Refund not found' });
        res.json({ success: true, data: refund });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const updateRefund = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Refund ID is required' });
        const error = validateUpdateRefund(req.body);
        if (error) return res.status(400).json({ success: false, message: error });
        const refund = await Refund.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!refund) return res.status(404).json({ success: false, message: 'Refund not found' });
        res.json({ success: true, data: refund });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const deleteRefund = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Refund ID is required' });
        const refund = await Refund.findByIdAndDelete(req.params.id);
        if (!refund) return res.status(404).json({ success: false, message: 'Refund not found' });
        res.json({ success: true, message: 'Refund deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};