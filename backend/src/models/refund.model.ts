import mongoose, { Document } from 'mongoose';

interface IRefund extends Document {
    paymentId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    refundId: string; // Auto-generated
    originalAmount: number;
    refundAmount: number;
    currency: string;
    reason: 'customer_request' | 'duplicate' | 'fraud' | 'cancelled' | 'error';
    status: 'pending' | 'completed' | 'failed';
    gatewayRefundId?: string; // PayHere refund reference
    gatewayResponse?: mongoose.Schema.Types.Mixed;
    createdAt?: Date;
    updatedAt?: Date;
}

const refundSchema = new mongoose.Schema<IRefund>({
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    refundId: {
        type: String,
        unique: true,
        required: true
    },
    originalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    refundAmount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    reason: {
        type: String,
        enum: ['customer_request', 'duplicate', 'fraud', 'cancelled', 'error'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    gatewayRefundId: String,
    gatewayResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Auto-generate refund ID
refundSchema.pre<IRefund>('save', async function(this: IRefund, next: (err?: Error) => void) {
    if (!this.refundId) {
        const count = await (this.constructor as mongoose.Model<IRefund>).countDocuments();
        this.refundId = `ZF-REF-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

refundSchema.index({ paymentId: 1 });
refundSchema.index({ userId: 1, status: 1 });

export default mongoose.model<IRefund>('Refund', refundSchema);