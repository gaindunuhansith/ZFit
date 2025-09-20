import PaymentMethod from '../models/payMethod.model.js'
import type { IPaymentMethod } from '../models/payMethod.model.js';

export const createPaymentMethodService = async (
    userId: string,
    data: Partial<IPaymentMethod>
): Promise<IPaymentMethod> => {
    const method = new PaymentMethod({ ...data, userId });
    return await method.save();
};

export const getPaymentMethodsService = async (
    userId: string
): Promise<IPaymentMethod[]> => {
    return await PaymentMethod.find({ userId });
};

export const getPaymentMethodByIdService = async (
    id: string
): Promise<IPaymentMethod | null> => {
    return await PaymentMethod.findById(id);
};

export const updatePaymentMethodService = async (
    id: string,
    data: Partial<IPaymentMethod>
): Promise<IPaymentMethod | null> => {
    return await PaymentMethod.findByIdAndUpdate(id, data, { new: true });
};

export const deletePaymentMethodService = async (
    id: string
): Promise<IPaymentMethod | null> => {
    return await PaymentMethod.findByIdAndDelete(id);
};