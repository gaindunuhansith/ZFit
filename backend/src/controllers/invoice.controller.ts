import type { Request, Response } from 'express';
import Invoice from '../models/invoice.model.js';

interface AuthenticatedRequest extends Request {
    user: {
        id: string;
        role?: string;
    };
}

// Updated validation functions to match the Invoice model fields
const validateCreateInvoice = (data: any): string | null => {
    if (!data.paymentId || !data.items || !data.subtotal || !data.total || !data.status || !data.generatedAt) {
        return 'Missing required fields: paymentId, items, subtotal, total, status, and generatedAt';
    }
    if (data.total <= 0) return 'Total must be positive';
    if (!['draft', 'sent', 'paid', 'overdue'].includes(data.status)) return 'Invalid status'; 
    if (!Array.isArray(data.items) || data.items.length === 0) return 'Items must be a non-empty array';
    return null;
};

const validateUpdateInvoice = (data: any): string | null => {
    if (data.total !== undefined && data.total <= 0) return 'Total must be positive';
    if (data.status && !['draft', 'sent', 'paid', 'overdue'].includes(data.status)) return 'Invalid status';  
    if (data.items && (!Array.isArray(data.items) || data.items.length === 0)) return 'Items must be a non-empty array';
    return null;
};

export const createInvoice = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const error = validateCreateInvoice(req.body);
        if (error) return res.status(400).json({ success: false, message: error });
        const invoice = new Invoice({ ...req.body, userId: req.user.id });  
        await invoice.save();
        res.status(201).json({ success: true, data: invoice });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const getInvoices = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const invoices = await Invoice.find({ userId: req.user.id });
        res.json({ success: true, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getInvoicesById = async (req: Request, res: Response) => {
    try {
        const invoices = await Invoice.findById(req.params.id);
        if (!invoices) return res.status(404).json({ success: false, message: 'Invoice not found' });
        res.json({ success: true, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const updateInvoice = async (req: Request, res: Response) => {
    try {
        const error = validateUpdateInvoice(req.body);
        if (error) return res.status(400).json({ success: false, message: error });
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
        res.json({ success: true, data: invoice });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const deleteInvoice = async (req: Request, res: Response) => {
    try {
        const invoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
        res.json({ success: true, message: 'Invoice deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};