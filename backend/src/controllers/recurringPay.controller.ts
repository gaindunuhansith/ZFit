import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
    createRecurringPaymentService,
    getRecurringPaymentsService,
    getRecurringPaymentByIdService,
    updateRecurringPaymentService,
    deleteRecurringPaymentService,
    pauseRecurringPaymentService,
    resumeRecurringPaymentService,
    cancelRecurringPaymentService,
    getDueRecurringPaymentsService,
    updatePaymentStatsService
} from '../services/recurringPay.service.js';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role?: string;
    };
}

// Validation functions
const validateCreateRecurringPayment = (data: any): string | null => {
    if (!data.userId || !data.membershipPlanId || !data.paymentMethodId || !data.amount || !data.frequency || !data.startDate || !data.nextPaymentDate) {
        return 'Missing required fields: userId, membershipPlanId, paymentMethodId, amount, frequency, startDate, and nextPaymentDate';
    }
    if (data.amount <= 0) return 'Amount must be positive';
    if (!['weekly', 'monthly', 'yearly'].includes(data.frequency)) return 'Invalid frequency - must be weekly, monthly, or yearly';
    if (data.status && !['active', 'paused', 'cancelled', 'expired'].includes(data.status)) return 'Invalid status';
    if (!mongoose.Types.ObjectId.isValid(data.userId)) return 'Invalid user ID';
    if (!mongoose.Types.ObjectId.isValid(data.membershipPlanId)) return 'Invalid membership plan ID';
    if (!mongoose.Types.ObjectId.isValid(data.paymentMethodId)) return 'Invalid payment method ID';
    return null;
};

const validateUpdateRecurringPayment = (data: any): string | null => {
    if (data.amount !== undefined && data.amount <= 0) return 'Amount must be positive';
    if (data.frequency && !['weekly', 'monthly', 'yearly'].includes(data.frequency)) return 'Invalid frequency - must be weekly, monthly, or yearly';
    if (data.status && !['active', 'paused', 'cancelled', 'expired'].includes(data.status)) return 'Invalid status';
    if (data.userId && !mongoose.Types.ObjectId.isValid(data.userId)) return 'Invalid user ID';
    if (data.membershipPlanId && !mongoose.Types.ObjectId.isValid(data.membershipPlanId)) return 'Invalid membership plan ID';
    if (data.paymentMethodId && !mongoose.Types.ObjectId.isValid(data.paymentMethodId)) return 'Invalid payment method ID';
    return null;
};

// Create recurring payment
export const createRecurringPayment = async (req: Request, res: Response) => {
    try {
        const error = validateCreateRecurringPayment(req.body);
        if (error) return res.status(400).json({ success: false, message: error });

        const recurringPayment = await createRecurringPaymentService(req.body);
        res.status(201).json({
            success: true,
            data: recurringPayment,
            message: 'Recurring payment created successfully'
        });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

// Get all recurring payments
export const getRecurringPayments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const recurringPayments = await getRecurringPaymentsService(userId);
        res.json({ success: true, data: recurringPayments });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

// Get single recurring payment by ID
export const getRecurringPaymentById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Recurring payment ID is required' });

        const recurringPayment = await getRecurringPaymentByIdService(req.params.id);
        res.json({ success: true, data: recurringPayment });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const statusCode = errorMessage.includes('not found') ? 404 : 500;
        res.status(statusCode).json({ success: false, message: errorMessage });
    }
};

// Update recurring payment
export const updateRecurringPayment = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Recurring payment ID is required' });

        const error = validateUpdateRecurringPayment(req.body);
        if (error) return res.status(400).json({ success: false, message: error });

        const recurringPayment = await updateRecurringPaymentService(req.params.id, req.body);
        res.json({
            success: true,
            data: recurringPayment,
            message: 'Recurring payment updated successfully'
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const statusCode = errorMessage.includes('not found') ? 404 : 500;
        res.status(statusCode).json({ success: false, message: errorMessage });
    }
};

// Delete recurring payment
export const deleteRecurringPayment = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Recurring payment ID is required' });

        await deleteRecurringPaymentService(req.params.id);
        res.json({ success: true, message: 'Recurring payment deleted successfully' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const statusCode = errorMessage.includes('not found') ? 404 : 500;
        res.status(statusCode).json({ success: false, message: errorMessage });
    }
};

// Pause recurring payment
export const pauseRecurringPayment = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Recurring payment ID is required' });

        const recurringPayment = await pauseRecurringPaymentService(req.params.id);
        res.json({
            success: true,
            data: recurringPayment,
            message: 'Recurring payment paused successfully'
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const statusCode = errorMessage.includes('not found') ? 404 : 500;
        res.status(statusCode).json({ success: false, message: errorMessage });
    }
};

// Resume recurring payment
export const resumeRecurringPayment = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Recurring payment ID is required' });

        const recurringPayment = await resumeRecurringPaymentService(req.params.id);
        res.json({
            success: true,
            data: recurringPayment,
            message: 'Recurring payment resumed successfully'
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const statusCode = errorMessage.includes('not found') ? 404 : 500;
        res.status(statusCode).json({ success: false, message: errorMessage });
    }
};

// Cancel recurring payment
export const cancelRecurringPayment = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Recurring payment ID is required' });

        const recurringPayment = await cancelRecurringPaymentService(req.params.id);
        res.json({
            success: true,
            data: recurringPayment,
            message: 'Recurring payment cancelled successfully'
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const statusCode = errorMessage.includes('not found') ? 404 : 500;
        res.status(statusCode).json({ success: false, message: errorMessage });
    }
};

// Get due recurring payments (admin endpoint)
export const getDueRecurringPayments = async (req: Request, res: Response) => {
    try {
        const duePayments = await getDueRecurringPaymentsService();
        res.json({ success: true, data: duePayments });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ success: false, message: errorMessage });
    }
};

// Update payment statistics (internal endpoint)
export const updatePaymentStats = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Recurring payment ID is required' });

        const { amount, success } = req.body;
        if (amount === undefined || success === undefined) {
            return res.status(400).json({ success: false, message: 'Amount and success status are required' });
        }

        const recurringPayment = await updatePaymentStatsService(req.params.id, amount, success);
        res.json({
            success: true,
            data: recurringPayment,
            message: 'Payment statistics updated successfully'
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const statusCode = errorMessage.includes('not found') ? 404 : 500;
        res.status(statusCode).json({ success: false, message: errorMessage });
    }
};