import Invoice from '../models/invoice.model.js';
import type { IInvoice } from '../models/invoice.model.js';
import mongoose from 'mongoose';

export const createInvoiceService = async (
    userId: string,
    data: Partial<IInvoice>
): Promise<IInvoice> => {
    const invoice = new Invoice({ ...data, userId });
    return await invoice.save();
};

export const getInvoicesService = async (userId: string): Promise<IInvoice[]> => {
    // If no userId provided (for testing), return all invoices
    if (!userId) {
        return await Invoice.find({});
    }
    return await Invoice.find({ userId });
};

export const getInvoiceByIdService = async (id: string): Promise<IInvoice | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Invoice.findById(id);
};

export const updateInvoiceService = async (
    id: string,
    data: Partial<IInvoice>
): Promise<IInvoice | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Invoice.findByIdAndUpdate(id, data, { new: true });
};

export const deleteInvoiceService = async (id: string): Promise<IInvoice | null> => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await Invoice.findByIdAndDelete(id);
};
