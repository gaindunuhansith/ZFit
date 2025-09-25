import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
    getAllSubscriptions,
    getSubscriptionById,
    getUserSubscriptions,
    getActiveSubscriptions,
    getExpiringSubscriptions,
    getUserActiveSubscription,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    pauseSubscription,
    resumeSubscription,
    extendSubscription,
    deleteSubscription
} from "../services/subscription.service.js";
import { CREATED, OK } from "../constants/http.js";

// Zod validation schemas
const createSubscriptionSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    membershipPlanId: z.string().min(1, "Membership plan ID is required"),
    startDate: z.string().datetime().optional(),
    transactionId: z.string().optional(),
    autoRenew: z.boolean().default(false),
    notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional()
});

const updateSubscriptionSchema = z.object({
    endDate: z.string().datetime().optional(),
    status: z.enum(['active', 'expired', 'cancelled', 'paused']).optional(),
    autoRenew: z.boolean().optional(),
    transactionId: z.string().optional(),
    notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional()
});

const subscriptionIdSchema = z.string().min(1, "Subscription ID is required");
const userIdSchema = z.string().min(1, "User ID is required");

const cancelSubscriptionSchema = z.object({
    reason: z.string().max(500, "Reason cannot exceed 500 characters").optional()
});

const pauseSubscriptionSchema = z.object({
    reason: z.string().max(500, "Reason cannot exceed 500 characters").optional()
});

const extendSubscriptionSchema = z.object({
    additionalDays: z.number().int().min(1, "Additional days must be at least 1")
});

const expiringDaysSchema = z.object({
    days: z.number().int().min(1).max(365).default(7)
});

// Controller handlers
export const getAllSubscriptionsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscriptions = await getAllSubscriptions();
        
        return res.status(OK).json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};

export const getSubscriptionByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscriptionId = subscriptionIdSchema.parse(req.params.id);
        const subscription = await getSubscriptionById(subscriptionId);
        
        return res.status(OK).json({
            success: true,
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

export const getUserSubscriptionsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = userIdSchema.parse(req.params.userId);
        const subscriptions = await getUserSubscriptions(userId);
        
        return res.status(OK).json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};

export const getActiveSubscriptionsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscriptions = await getActiveSubscriptions();
        
        return res.status(OK).json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};

export const getExpiringSubscriptionsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { days } = expiringDaysSchema.parse(req.query);
        const subscriptions = await getExpiringSubscriptions(days);
        
        return res.status(OK).json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
};

export const getUserActiveSubscriptionHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = userIdSchema.parse(req.params.userId);
        const subscription = await getUserActiveSubscription(userId);
        
        return res.status(OK).json({
            success: true,
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

export const createSubscriptionHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscriptionData = createSubscriptionSchema.parse(req.body);
        
        // Convert startDate string to Date if provided
        const processedData = {
            ...subscriptionData,
            startDate: subscriptionData.startDate ? new Date(subscriptionData.startDate) : undefined
        };
        
        const subscription = await createSubscription(processedData);
        
        return res.status(CREATED).json({
            success: true,
            message: "Subscription created successfully",
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

export const updateSubscriptionHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscriptionId = subscriptionIdSchema.parse(req.params.id);
        const updateData = updateSubscriptionSchema.parse(req.body);
        
        // Convert endDate string to Date if provided
        const processedData = {
            ...updateData,
            endDate: updateData.endDate ? new Date(updateData.endDate) : undefined
        };
        
        const subscription = await updateSubscription(subscriptionId, processedData);
        
        return res.status(OK).json({
            success: true,
            message: "Subscription updated successfully",
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

export const cancelSubscriptionHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscriptionId = subscriptionIdSchema.parse(req.params.id);
        const { reason } = cancelSubscriptionSchema.parse(req.body);
        
        const subscription = await cancelSubscription(subscriptionId, reason);
        
        return res.status(OK).json({
            success: true,
            message: "Subscription cancelled successfully",
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

export const pauseSubscriptionHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscriptionId = subscriptionIdSchema.parse(req.params.id);
        const { reason } = pauseSubscriptionSchema.parse(req.body);
        
        const subscription = await pauseSubscription(subscriptionId, reason);
        
        return res.status(OK).json({
            success: true,
            message: "Subscription paused successfully",
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

export const resumeSubscriptionHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscriptionId = subscriptionIdSchema.parse(req.params.id);
        const subscription = await resumeSubscription(subscriptionId);
        
        return res.status(OK).json({
            success: true,
            message: "Subscription resumed successfully",
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

export const extendSubscriptionHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscriptionId = subscriptionIdSchema.parse(req.params.id);
        const { additionalDays } = extendSubscriptionSchema.parse(req.body);
        
        const subscription = await extendSubscription(subscriptionId, additionalDays);
        
        return res.status(OK).json({
            success: true,
            message: "Subscription extended successfully",
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

export const deleteSubscriptionHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const subscriptionId = subscriptionIdSchema.parse(req.params.id);
        const result = await deleteSubscription(subscriptionId);
        
        return res.status(OK).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        next(error);
    }
};