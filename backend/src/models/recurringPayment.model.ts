import mongoose, { Document } from 'mongoose';

export interface IRecurringPayment extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    frequency: 'monthly' | 'quarterly' | 'yearly' | 'weekly';
    nextPaymentDate: Date;
    endDate?: Date;
    status: 'active' | 'paused' | 'cancelled' | 'completed';
    paymentMethodId: mongoose.Types.ObjectId;
    relatedId: mongoose.Types.ObjectId; // Ref to membership/booking/etc.
    relatedType: 'membership' | 'booking' | 'other';
    autoRenewal: boolean;
    failureCount: number;
    lastPaymentDate?: Date;
    lastPaymentId?: mongoose.Types.ObjectId;
    maxFailures: number;
    description?: string;
    metadata?: mongoose.Schema.Types.Mixed;
    createdAt?: Date;
    updatedAt?: Date;
}

const recurringPaymentSchema = new mongoose.Schema<IRecurringPayment>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    currency: {
        type: String,
        required: true,
        default: 'LKR'
    },
    frequency: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly', 'weekly'],
        required: true
    },
    nextPaymentDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'cancelled', 'completed'],
        required: true,
        default: 'active'
    },
    paymentMethodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PayMethod',
        required: true
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true // Ref based on relatedType
    },
    relatedType: {
        type: String,
        enum: ['membership', 'booking', 'other'],
        required: true
    },
    autoRenewal: {
        type: Boolean,
        default: true
    },
    failureCount: {
        type: Number,
        default: 0
    },
    lastPaymentDate: {
        type: Date
    },
    lastPaymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    maxFailures: {
        type: Number,
        default: 3
    },
    description: {
        type: String
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Indexes for performance
recurringPaymentSchema.index({ userId: 1, status: 1 });
recurringPaymentSchema.index({ nextPaymentDate: 1, status: 1 });
recurringPaymentSchema.index({ status: 1, nextPaymentDate: -1 });
recurringPaymentSchema.index({ relatedId: 1, relatedType: 1 });

export default mongoose.model<IRecurringPayment>('RecurringPayment', recurringPaymentSchema);