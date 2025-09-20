import mongoose, { Document } from 'mongoose';

export interface IPayment extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    type: 'membership' | 'inventory' | 'booking' | 'other';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    method: 'card' | 'bank-transfer' | 'cash';
    relatedId: mongoose.Types.ObjectId; // Ref to booking/inventory/etc.
    transactionId: string;
    gatewayTransactionId?: string; // PayHere transaction ID
    gatewayPaymentId?: string; // PayHere-specific
    gatewayResponse?: mongoose.Schema.Types.Mixed; // PayHere response object
    failureReason?: string;
    refundedAmount: number;
    refundReason?: string;
    date: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const paymentSchema = new mongoose.Schema<IPayment>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    type: {
        type: String,
        enum: ['membership', 'inventory', 'booking', 'other'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        required: true
    },
    method: {
        type: String,
        enum: ['card', 'bank-transfer', 'cash'],
        required: true
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true // Ref based on type (e.g., Membership, Inventory)
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
        index: true  // Keep this for performance
    },
    gatewayTransactionId: String, // PayHere transaction reference
    gatewayPaymentId: String, // PayHere payment ID
    gatewayResponse: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }, // Store full PayHere response
    failureReason: String,
    refundedAmount: {
        type: Number,
        default: 0
    },
    refundReason: String,
    date: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// Indexes for performance (as per docs)
paymentSchema.index({ userId: 1, status: 1 });
// paymentSchema.index({ transactionId: 1 }); // Removed duplicate index
paymentSchema.index({ date: 1, type: 1 });
paymentSchema.index({ status: 1, date: -1 });

export default mongoose.model<IPayment>('Payment', paymentSchema);