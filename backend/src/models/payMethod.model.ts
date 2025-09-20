import mongoose, { Document } from 'mongoose';

export interface IPaymentMethod extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'card' | 'bank-transfer' | 'cash';
    provider: string; // e.g., 'payhere', 'visa'
    maskedNumber?: string; // Masked card/bank number
    expiryMonth?: string;
    expiryYear?: string;
    gatewayToken?: string; // PayHere token for saved methods
    isDefault: boolean;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const paymentMethodSchema = new mongoose.Schema<IPaymentMethod>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['card', 'bank-transfer', 'cash'],
        required: true
    },
    provider: {
        type: String,
        required: true
    },
    maskedNumber: String, // e.g., "**** **** **** 1234"
    expiryMonth: String,
    expiryYear: String,
    gatewayToken: String, // For PayHere saved payments

    isDefault: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Ensure one default per user
paymentMethodSchema.pre<IPaymentMethod>('save', async function(this: IPaymentMethod, next: (err?: Error) => void) {
    if (this.isDefault) {
        await (this.constructor as mongoose.Model<IPaymentMethod>).updateMany(
            { userId: this.userId, _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
    next();
});

paymentMethodSchema.index({ userId: 1, isActive: 1 });

export default mongoose.model<IPaymentMethod>('PaymentMethod', paymentMethodSchema);