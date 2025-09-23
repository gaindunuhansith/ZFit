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
    processRecurringPaymentService,
    getDueRecurringPaymentsService,
    getRecurringPaymentsByRelatedService
} from '../services/recurringPayment.services.js';

// Validation functions
const validateCreateRecurringPayment = (data: any): string | null => {
    if (!data.amount || !data.frequency || !data.nextPaymentDate || !data.paymentMethodId || !data.relatedId || !data.relatedType) {
        return 'Missing required fields';
    }
    if (data.amount < 0) return 'Amount must be non-negative';
    if (!['monthly', 'quarterly', 'yearly', 'weekly'].includes(data.frequency)) return 'Invalid frequency';
    if (!['membership', 'booking', 'other'].includes(data.relatedType)) return 'Invalid related type';
    if (!['active', 'paused', 'cancelled', 'completed'].includes(data.status || 'active')) return 'Invalid status';
    return null;
};

const validateUpdateRecurringPayment = (data: any): string | null => {
    if (data.amount !== undefined && data.amount < 0) return 'Amount must be non-negative';
    if (data.frequency && !['monthly', 'quarterly', 'yearly', 'weekly'].includes(data.frequency)) return 'Invalid frequency';
    if (data.relatedType && !['membership', 'booking', 'other'].includes(data.relatedType)) return 'Invalid related type';
    if (data.status && !['active', 'paused', 'cancelled', 'completed'].includes(data.status)) return 'Invalid status';
    return null;
};

// Create recurring payment
export const createRecurringPayment = async (req: Request, res: Response) => {
    try {
        const error = validateCreateRecurringPayment(req.body);
        if (error) return res.status(400).json({ success: false, message: error });

        const recurringPaymentData = {
            ...req.body,
            userId: req.body.userId || new mongoose.Types.ObjectId().toString() // Dummy for testing
        };

        const recurringPayment = await createRecurringPaymentService(recurringPaymentData);
        res.status(201).json({
            success: true,
            message: 'Recurring payment created successfully',
            data: recurringPayment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};

// Get all recurring payments (for user or admin)
export const getRecurringPayments = async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string || '';
        const recurringPayments = await getRecurringPaymentsService(userId);
        res.status(200).json({
            success: true,
            data: recurringPayments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};

// Get single recurring payment by ID
export const getRecurringPaymentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Recurring payment ID is required'
            });
        }

        const recurringPayment = await getRecurringPaymentByIdService(id);

        if (!recurringPayment) {
            return res.status(404).json({
                success: false,
                message: 'Recurring payment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: recurringPayment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};

// Update recurring payment
export const updateRecurringPayment = async (req: Request, res: Response) => {
    try {
        const error = validateUpdateRecurringPayment(req.body);
        if (error) return res.status(400).json({ success: false, message: error });

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Recurring payment ID is required'
            });
        }

        const recurringPayment = await getRecurringPaymentByIdService(id);

        if (!recurringPayment) {
            return res.status(404).json({
                success: false,
                message: 'Recurring payment not found'
            });
        }

        const updatedRecurringPayment = await updateRecurringPaymentService(id, req.body);
        res.status(200).json({
            success: true,
            message: 'Recurring payment updated successfully',
            data: updatedRecurringPayment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};

// Delete recurring payment (cancel)
export const deleteRecurringPayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Recurring payment ID is required'
            });
        }

        const recurringPayment = await getRecurringPaymentByIdService(id);

        if (!recurringPayment) {
            return res.status(404).json({
                success: false,
                message: 'Recurring payment not found'
            });
        }

        const deletedRecurringPayment = await deleteRecurringPaymentService(id);
        res.status(200).json({
            success: true,
            message: 'Recurring payment cancelled successfully',
            data: deletedRecurringPayment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};

// Pause recurring payment
export const pauseRecurringPayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Recurring payment ID is required'
            });
        }

        const recurringPayment = await getRecurringPaymentByIdService(id);

        if (!recurringPayment) {
            return res.status(404).json({
                success: false,
                message: 'Recurring payment not found'
            });
        }

        const pausedRecurringPayment = await pauseRecurringPaymentService(id);
        res.status(200).json({
            success: true,
            message: 'Recurring payment paused successfully',
            data: pausedRecurringPayment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};

// Resume recurring payment
export const resumeRecurringPayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Recurring payment ID is required'
            });
        }

        const recurringPayment = await getRecurringPaymentByIdService(id);

        if (!recurringPayment) {
            return res.status(404).json({
                success: false,
                message: 'Recurring payment not found'
            });
        }

        const resumedRecurringPayment = await resumeRecurringPaymentService(id);
        res.status(200).json({
            success: true,
            message: 'Recurring payment resumed successfully',
            data: resumedRecurringPayment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};

// Process recurring payment (admin/staff only)
export const processRecurringPayment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Recurring payment ID is required'
            });
        }

        const result = await processRecurringPaymentService(id);

        res.status(200).json({
            success: true,
            message: 'Recurring payment processed successfully',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};

// Get due recurring payments (admin/staff only)
export const getDueRecurringPayments = async (req: Request, res: Response) => {
    try {
        const duePayments = await getDueRecurringPaymentsService();
        res.status(200).json({
            success: true,
            data: duePayments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};

// Get recurring payments by related entity
export const getRecurringPaymentsByRelated = async (req: Request, res: Response) => {
    try {
        const { relatedId, relatedType } = req.params;

        if (!relatedId || !relatedType) {
            return res.status(400).json({
                success: false,
                message: 'Related ID and type are required'
            });
        }

        const recurringPayments = await getRecurringPaymentsByRelatedService(relatedId, relatedType);
        res.status(200).json({
            success: true,
            data: recurringPayments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};