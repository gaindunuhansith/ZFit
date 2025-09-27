import Invoice from '../models/invoice.model.js';
import type { IInvoice } from '../models/invoice.model.js';
import mongoose from 'mongoose';

export const createInvoiceService = async (
    data: Record<string, any>
): Promise<IInvoice> => {
    const invoice = new Invoice(data);
    return await invoice.save();
};

export const getInvoicesService = async (userId?: string): Promise<IInvoice[]> => {
    if (userId) {
        return await Invoice.find({ userId });
    } else {
        // For testing purposes, return all invoices if no userId provided
        return await Invoice.find({});
    }
};

export const getInvoiceByIdService = async (id: string): Promise<IInvoice | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Invoice.findById(id);
};

export const updateInvoiceService = async (
    id: string,
    data: Record<string, any>
): Promise<IInvoice | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Invoice.findByIdAndUpdate(id, data, { new: true });
};

export const deleteInvoiceService = async (id: string): Promise<IInvoice | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Invoice.findByIdAndDelete(id);
};
