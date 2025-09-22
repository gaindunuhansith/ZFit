import type { Request, Response } from 'express';
import {
    createRecurringPaymentService,
    getRecurringPaymentsService,
    getRecurringPaymentByIdService,
    updateRecurringPaymentService,
    deleteRecurringPaymentService,
    pauseRecurringPaymentService,
    resumeRecurringPaymentService
} from '../services/recurringPay.service.js';
import type { RecurringPaymentData, AuthenticatedRequest } from '../types/recurringPayment.types.js';

interface AuthenticatedRequestExtended extends Request, AuthenticatedRequest {}

// Validation functions
const validateCreateRecurringPayment = (data: RecurringPaymentData): string | null => {
    if (!data.userId || !data.membershipPlanId || !data.paymentMethodId || !data.amount || !data.frequency || !data.startDate || !data.nextPaymentDate) {
        return 'Missing required fields: userId, membershipPlanId, paymentMethodId, amount, frequency, startDate, and nextPaymentDate';
    }
    if (data.amount <= 0) return 'Amount must be positive';
    if (!['weekly', 'monthly', 'yearly'].includes(data.frequency)) return 'Invalid frequency - must be weekly, monthly, or yearly';
    if (data.status && !['active', 'paused', 'cancelled'].includes(data.status)) return 'Invalid status - must be active, paused, or cancelled';
    return null;
};

const validateUpdateRecurringPayment = (data: RecurringPaymentData): string | null => {
    if (data.amount !== undefined && data.amount <= 0) return 'Amount must be positive';
    if (data.frequency && !['weekly', 'monthly', 'yearly'].includes(data.frequency)) return 'Invalid frequency - must be weekly, monthly, or yearly';
    if (data.status && !['active', 'paused', 'cancelled'].includes(data.status)) return 'Invalid status - must be active, paused, or cancelled';
    return null;
};

export const createRecurringPayment = async (req: Request, res: Response) => {
    try {
        const error = validateCreateRecurringPayment(req.body);
        if (error) return res.status(400).json({ success: false, message: error });
        const recurring = await createRecurringPaymentService(req.body);
        res.status(201).json({ success: true, data: recurring });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const getRecurringPayments = async (req: AuthenticatedRequestExtended, res: Response) => {
    try {
        // Use authenticated user ID if available, otherwise get all recurring payments
        const userId = req.user?.id;
        const recurrings = await getRecurringPaymentsService(userId);
        res.json({ success: true, data: recurrings });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getRecurringPaymentById = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Recurring payment ID is required' });
        const recurring = await getRecurringPaymentByIdService(req.params.id);
        res.json({ success: true, data: recurring });
    } catch (error) {
        res.status(404).json({ success: false, message: (error as Error).message });
    }
};

export const updateRecurringPayment = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Recurring payment ID is required' });
        const error = validateUpdateRecurringPayment(req.body);
        if (error) return res.status(400).json({ success: false, message: error });
        const recurring = await updateRecurringPaymentService(req.params.id, req.body);
        res.json({ success: true, data: recurring });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const deleteRecurringPayment = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Recurring payment ID is required' });
        await deleteRecurringPaymentService(req.params.id);
        res.json({ success: true, message: 'Recurring payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const pauseRecurringPayment = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Recurring payment ID is required' });
        const recurring = await pauseRecurringPaymentService(req.params.id);
        res.json({ success: true, data: recurring });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const resumeRecurringPayment = async (req: Request, res: Response) => {
    try {
        if (!req.params.id) return res.status(400).json({ success: false, message: 'Recurring payment ID is required' });
        const recurring = await resumeRecurringPaymentService(req.params.id);
        res.json({ success: true, data: recurring });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};