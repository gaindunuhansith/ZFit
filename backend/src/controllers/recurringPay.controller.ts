import type { Request, Response } from 'express';
import RecurringPayment from '../models/recurringPay.model.js';
//middleware

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        role?: string;
    };
}

export const createRecurringPayment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const recurring = new RecurringPayment(req.body);
        await recurring.save();
        res.status(201).json({ success: true, data: recurring });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const getRecurringPayments = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const recurrings = await RecurringPayment.find({ userId: req.user.id });
        res.json({ success: true, data: recurrings });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getRecurringPaymentById = async (req: Request, res: Response) => {
    try {
        const recurring = await RecurringPayment.findById(req.params.id);
        if (!recurring) return res.status(404).json({ success: false, message: 'Recurring payment not found' });
        res.json({ success: true, data: recurring });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const updateRecurringPayment = async (req: Request, res: Response) => {
    try {
        const recurring = await RecurringPayment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!recurring) return res.status(404).json({ success: false, message: 'Recurring payment not found' });
        res.json({ success: true, data: recurring });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const deleteRecurringPayment = async (req: Request, res: Response) => {
    try {
        const recurring = await RecurringPayment.findByIdAndDelete(req.params.id);
        if (!recurring) return res.status(404).json({ success: false, message: 'Recurring payment not found' });
        res.json({ success: true, message: 'Recurring payment deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const pauseRecurringPayment = async (req: Request, res: Response) => {
    try {
        const recurring = await RecurringPayment.findByIdAndUpdate(req.params.id, { status: 'paused' }, { new: true });
        res.json({ success: true, data: recurring });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const resumeRecurringPayment = async (req: Request, res: Response) => {
    try {
        const recurring = await RecurringPayment.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
        if (!recurring) return res.status(404).json({ success: false, message: 'Recurring payment not found' });
        res.json({ success: true, data: recurring });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};