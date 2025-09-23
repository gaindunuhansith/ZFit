import mongoose, { Document } from 'mongoose';

export interface IRecurringPayment extends Document {
    userId: mongoose.Types.ObjectId;
    membershipPlanId: mongoose.Types.ObjectId;
    paymentMethodId: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    frequency: 'weekly' | 'monthly' | 'yearly';
    status: 'active' | 'paused' | 'cancelled' | 'expired';
    startDate: Date;
    nextPaymentDate: Date;
    endDate?: Date; // Optional end date for limited subscriptions
    subscriptionId: string; // Auto-generated unique subscription ID
    gatewaySubscriptionId?: string; // PayHere subscription reference
    gatewayToken?: string; // PayHere token for recurring payments
    gatewayResponse?: mongoose.Schema.Types.Mixed; // Store full gateway response
    lastPaymentDate?: Date;
    lastPaymentAmount?: number;
    totalPayments: number;
    successfulPayments: number;
    failedPayments: number;
    failureReason?: string;
    retryCount: number;
    maxRetries: number;
    isActive: boolean;
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
        default: 'LKR'
    },
    frequency: {
        type: String,
        enum: ['weekly', 'monthly', 'yearly'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'cancelled', 'expired'],
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
    endDate: Date, // Optional end date for limited subscriptions
    subscriptionId: {
        type: String,
        unique: true,
        required: true
    },
    gatewaySubscriptionId: String, // PayHere subscription reference
    gatewayToken: String, // PayHere token for recurring payments
    gatewayResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }, // Store full gateway response
    lastPaymentDate: Date,
    lastPaymentAmount: Number,
    totalPayments: {
        type: Number,
        default: 0
    },
    successfulPayments: {
        type: Number,
        default: 0
    },
    failedPayments: {
        type: Number,
        default: 0
    },
    failureReason: String,
    retryCount: {
        type: Number,
        default: 0
    },
    maxRetries: {
        type: Number,
        default: 3
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Auto-generate subscription ID
recurringPaymentSchema.pre<IRecurringPayment>('save', async function(this: IRecurringPayment, next: (err?: Error) => void) {
    if (!this.subscriptionId) {
        const count = await (this.constructor as mongoose.Model<IRecurringPayment>).countDocuments();
        this.subscriptionId = `ZF-SUB-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

// Indexes for performance
recurringPaymentSchema.index({ userId: 1, status: 1 });
recurringPaymentSchema.index({ userId: 1, isActive: 1 });
recurringPaymentSchema.index({ nextPaymentDate: 1, status: 1 });
recurringPaymentSchema.index({ paymentMethodId: 1 });
recurringPaymentSchema.index({ membershipPlanId: 1 });

// Virtual for calculating days until next payment
recurringPaymentSchema.virtual('daysUntilNextPayment').get(function(this: IRecurringPayment) {
    const now = new Date();
    const diffTime = this.nextPaymentDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to calculate next payment date based on frequency
recurringPaymentSchema.methods.calculateNextPaymentDate = function(): Date {
    const current = new Date(this.nextPaymentDate);

    switch (this.frequency) {
        case 'weekly':
            current.setDate(current.getDate() + 7);
            break;
        case 'monthly':
            current.setMonth(current.getMonth() + 1);
            break;
        case 'yearly':
            current.setFullYear(current.getFullYear() + 1);
            break;
    }

    return current;
};

// Method to check if subscription should be expired
recurringPaymentSchema.methods.shouldExpire = function(): boolean {
    if (!this.endDate) return false;
    return new Date() > this.endDate;
};

export default mongoose.model<IRecurringPayment>('RecurringPayment', recurringPaymentSchema);