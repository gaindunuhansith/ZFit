import mongoose from 'mongoose';
import Refund from '../models/refund.model.js';

export const createRefundService = async (data: any) => {
    try {
        const refund = new Refund(data);
        return await refund.save();
    } catch (error) {
        throw new Error(`Failed to create refund: ${(error as Error).message}`);
    }
};

export const getRefundsService = async (userId?: string) => {
    try {
        const filter = userId ? { userId } : {};
        return await Refund.find(filter);
    } catch (error) {
        throw new Error(`Failed to fetch refunds: ${(error as Error).message}`);
    }
};

export const getRefundByIdService = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid refund ID');
        }
        const refund = await Refund.findById(id);
        if (!refund) {
            throw new Error('Refund not found');
        }
        return refund;
    } catch (error) {
        throw new Error(`Failed to fetch refund: ${(error as Error).message}`);
    }
};

export const updateRefundService = async (id: string, data: any) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid refund ID');
        }
        const refund = await Refund.findByIdAndUpdate(id, data, { new: true });
        if (!refund) {
            throw new Error('Refund not found');
        }
        return refund;
    } catch (error) {
        throw new Error(`Failed to update refund: ${(error as Error).message}`);
    }
};

export const deleteRefundService = async (id: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid refund ID');
        }
        const refund = await Refund.findByIdAndDelete(id);
        if (!refund) {
            throw new Error('Refund not found');
        }
        return refund;
    } catch (error) {
        throw new Error(`Failed to delete refund: ${(error as Error).message}`);
    }
};