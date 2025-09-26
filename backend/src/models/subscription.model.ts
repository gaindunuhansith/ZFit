import mongoose from "mongoose";

export interface SubscriptionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  membershipPlanId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled' | 'paused';
  transactionId?: string;
  autoRenew: boolean;
  renewalAttempts: number;
  lastRenewalDate?: Date;
  cancellationDate?: Date;
  cancellationReason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  isActive(): boolean;
  daysRemaining(): number;
  isExpired(): boolean;
  totalDuration(): number;
}

interface SubscriptionModel extends mongoose.Model<SubscriptionDocument> {
  findActiveSubscriptions(): Promise<SubscriptionDocument[]>;
  findExpiringSubscriptions(daysAhead?: number): Promise<SubscriptionDocument[]>;
  findByUser(userId: mongoose.Types.ObjectId): Promise<SubscriptionDocument[]>;
}

const subscriptionSchema = new mongoose.Schema<SubscriptionDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, "User ID is required"],
      index: true,
    },
    membershipPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
      required: [true, "Membership plan ID is required"],
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      default: Date.now,
      validate: {
        validator: function(v: Date) {
          return v <= new Date();
        },
        message: 'Start date cannot be in the future'
      }
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function(this: SubscriptionDocument, v: Date) {
          return v > this.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'expired', 'cancelled', 'paused'],
        message: 'Status must be one of: active, expired, cancelled, paused'
      },
      required: [true, "Status is required"],
      default: 'active',
      index: true,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    autoRenew: {
      type: Boolean,
      default: false,
      index: true,
    },
    renewalAttempts: {
      type: Number,
      default: 0,
      min: [0, "Renewal attempts cannot be negative"],
    },
    lastRenewalDate: {
      type: Date,
    },
    cancellationDate: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      maxlength: [500, "Cancellation reason cannot exceed 500 characters"],
      trim: true,
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1, status: 1 });
subscriptionSchema.index({ status: 1, autoRenew: 1 });
subscriptionSchema.index({ createdAt: -1 });

// Instance methods
subscriptionSchema.methods.isActive = function(): boolean {
  const now = new Date();
  return this.status === 'active' && this.endDate > now;
};

subscriptionSchema.methods.daysRemaining = function(): number {
  const now = new Date();
  const timeDiff = this.endDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff > 0 ? daysDiff : 0;
};

subscriptionSchema.methods.isExpired = function(): boolean {
  const now = new Date();
  return this.endDate <= now;
};

subscriptionSchema.methods.totalDuration = function(): number {
  const timeDiff = this.endDate.getTime() - this.startDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

// Pre-save middleware to auto-update status based on dates
subscriptionSchema.pre('save', function(next) {
  const now = new Date();

  
  // Auto-expire if end date has passed and status is still active
  if (this.status === 'active' && this.endDate <= now) {
    this.status = 'expired';
  }
  
  next();
});

// Static methods
subscriptionSchema.statics.findActiveSubscriptions = function() {
  return this.find({ 
    status: 'active', 
    endDate: { $gt: new Date() } 
  }).populate('userId membershipPlanId');
};

subscriptionSchema.statics.findExpiringSubscriptions = function(daysAhead: number = 7) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + daysAhead);
  
  return this.find({
    status: 'active',
    endDate: { $gte: now, $lte: futureDate }
  }).populate('userId membershipPlanId');
};

subscriptionSchema.statics.findByUser = function(userId: mongoose.Types.ObjectId) {
  return this.find({ userId }).populate('membershipPlanId').sort({ createdAt: -1 });
};

const SubscriptionModel = mongoose.model<SubscriptionDocument, SubscriptionModel>(
  "Subscription",
  subscriptionSchema
);

export default SubscriptionModel;