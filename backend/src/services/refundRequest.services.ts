import mongoose from 'mongoose';
import RefundRequest from '../models/refundRequest.model.js';

export const createRefundRequestService = async (data: any) => {
    const refundRequest = new RefundRequest(data);
    return await refundRequest.save();
};

export const getRefundRequestsService = async (status?: string) => {
    const filter = status ? { status } : {};
    return await RefundRequest.find(filter)
        .populate('userId', 'name email contactNo')
        .populate('paymentId', 'amount transactionId type createdAt')
        .sort({ createdAt: -1 });
};

export const getRefundRequestByIdService = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid refund request ID');
    }
    const refundRequest = await RefundRequest.findById(id)
        .populate('userId', 'name email contactNo profile')
        .populate('paymentId', 'amount transactionId type createdAt relatedId');

    if (!refundRequest) {
        throw new Error('Refund request not found');
    }
    return refundRequest;
};

export const getRefundRequestsByUserService = async (userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
    }
    return await RefundRequest.find({ userId })
        .populate('paymentId', 'amount transactionId type createdAt')
        .sort({ createdAt: -1 });
};

export const updateRefundRequestService = async (id: string, data: any) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid refund request ID');
    }
    const refundRequest = await RefundRequest.findByIdAndUpdate(id, data, { new: true });
    if (!refundRequest) {
        throw new Error('Refund request not found');
    }
    return refundRequest;
};

export const deleteRefundRequestService = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid refund request ID');
    }
    const refundRequest = await RefundRequest.findByIdAndDelete(id);
    if (!refundRequest) {
        throw new Error('Refund request not found');
    }
    return refundRequest;
};

export const approveRefundRequestService = async (id: string, adminNotes?: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid refund request ID');
    }

    const refundRequest = await RefundRequest.findByIdAndUpdate(
        id,
        {
            status: 'approved',
            adminNotes,
            updatedAt: new Date()
        },
        { new: true }
    );

    if (!refundRequest) {
        throw new Error('Refund request not found');
    }

    return refundRequest;
};

export const declineRefundRequestService = async (id: string, adminNotes?: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid refund request ID');
    }

    const refundRequest = await RefundRequest.findByIdAndUpdate(
        id,
        {
            status: 'declined',
            adminNotes,
            updatedAt: new Date()
        },
        { new: true }
    );

    if (!refundRequest) {
        throw new Error('Refund request not found');
    }

    return refundRequest;
};

export const getPendingRequestsCountService = async () => {
    return await RefundRequest.countDocuments({ status: 'pending' });
};