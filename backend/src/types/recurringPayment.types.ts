export interface RecurringPaymentData {
    userId?: string;
    membershipPlanId?: string;
    paymentMethodId?: string;
    amount?: number;
    frequency?: string;
    status?: string;
    startDate?: Date;
    nextPaymentDate?: Date;
}

export interface AuthenticatedRequest {
    user?: {
        id: string;
        role?: string;
    };
}