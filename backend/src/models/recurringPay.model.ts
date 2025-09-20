import mongoose, { Document } from 'mongoose';

export interface IRecurringPayment extends Document {
    userId: mongoose.Types.ObjectId;
    membershipPlanId: mongoose.Types.ObjectId;
    paymentMethodId: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    frequency: 'weekly' | 'monthly' | 'yearly';
    status: 'active' | 'paused' | 'cancelled';
    startDate: Date;
    nextPaymentDate: Date;
    gatewaySubscriptionId?: string; // PayHere subscription reference
    createdAt?: Date;
    updatedAt?: Date;
}

const recurringPaymentSchema = new mongoose.Schema<IRecurringPayment>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    membershipPlanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MembershipPlan',
        required: true
    },
    paymentMethodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethod',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    frequency: {
        type: String,
        enum: ['weekly', 'monthly', 'yearly'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'cancelled'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true
    },
    nextPaymentDate: {
        type: Date,
        required: true
    },
    gatewaySubscriptionId: String
}, {
    timestamps: true
});

recurringPaymentSchema.index({ userId: 1, status: 1 });
recurringPaymentSchema.index({ nextPaymentDate: 1, status: 1 });

export default mongoose.model<IRecurringPayment>('RecurringPayment', recurringPaymentSchema);