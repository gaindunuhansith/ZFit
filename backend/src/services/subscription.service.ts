import SubscriptionModel from "../models/subscription.model.js";
import MembershipPlanModel from "../models/membership.model.js";
import UserModel from "../models/user.model.js";
import AppAssert from "../util/AppAssert.js";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../constants/http.js";

type CreateSubscriptionParams = {
    userId: string;
    membershipPlanId: string;
    startDate?: Date | undefined;
    transactionId?: string | undefined;
    autoRenew?: boolean | undefined;
    notes?: string | undefined;
};

type UpdateSubscriptionParams = {
    endDate?: Date | undefined;
    status?: 'active' | 'expired' | 'cancelled' | 'paused' | undefined;
    autoRenew?: boolean | undefined;
    transactionId?: string | undefined;
    notes?: string | undefined;
};

export const getAllSubscriptions = async () => {
    const subscriptions = await SubscriptionModel.find()
        .populate('userId', 'name email')
        .populate('membershipPlanId', 'name price durationInDays category');
    return subscriptions;
};

export const getSubscriptionById = async (subscriptionId: string) => {
    const subscription = await SubscriptionModel.findById(subscriptionId)
        .populate('userId', 'name email')
        .populate('membershipPlanId', 'name price durationInDays category');
    AppAssert(subscription, NOT_FOUND, "Subscription not found");
    return subscription;
};

export const getUserSubscriptions = async (userId: string) => {
    const subscriptions = await SubscriptionModel.find({ userId })
        .populate('membershipPlanId', 'name price durationInDays category')
        .sort({ createdAt: -1 });
    return subscriptions;
};

export const getActiveSubscriptions = async () => {
    const subscriptions = await SubscriptionModel.findActiveSubscriptions();
    return subscriptions;
};

export const getExpiringSubscriptions = async (days: number = 7) => {
    const subscriptions = await SubscriptionModel.findExpiringSubscriptions(days);
    return subscriptions;
};

export const getUserActiveSubscription = async (userId: string) => {
    const subscription = await SubscriptionModel.findOne({
        userId,
        status: 'active',
        endDate: { $gt: new Date() }
    }).populate('membershipPlanId', 'name price durationInDays category');
    
    return subscription;
};

export const createSubscription = async (data: CreateSubscriptionParams) => {
    // Verify user exists
    const user = await UserModel.findById(data.userId);
    AppAssert(user, NOT_FOUND, "User not found");

    // Verify membership plan exists
    const membershipPlan = await MembershipPlanModel.findById(data.membershipPlanId);
    AppAssert(membershipPlan, NOT_FOUND, "Membership plan not found");

    // Check if user already has active subscription
    const existingSubscription = await SubscriptionModel.findOne({
        userId: data.userId,
        status: 'active',
        endDate: { $gt: new Date() }
    });
    AppAssert(!existingSubscription, CONFLICT, "User already has an active subscription");

    // Calculate end date
    const startDate = data.startDate || new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + membershipPlan.durationInDays);

    const subscription = await SubscriptionModel.create({
        userId: data.userId,
        membershipPlanId: data.membershipPlanId,
        startDate,
        endDate,
        transactionId: data.transactionId,
        autoRenew: data.autoRenew || false,
        notes: data.notes
    });

    AppAssert(subscription, INTERNAL_SERVER_ERROR, "Failed to create subscription");

    // Return with populated data
    const populatedSubscription = await SubscriptionModel.findById(subscription._id)
        .populate('userId', 'name email')
        .populate('membershipPlanId', 'name price durationInDays category');

    return populatedSubscription;
};

export const updateSubscription = async (subscriptionId: string, updateData: UpdateSubscriptionParams) => {
    const subscription = await SubscriptionModel.findById(subscriptionId);
    AppAssert(subscription, NOT_FOUND, "Subscription not found");

    const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
        subscriptionId,
        updateData,
        { new: true }
    )
    .populate('userId', 'name email')
    .populate('membershipPlanId', 'name price durationInDays category');

    AppAssert(updatedSubscription, INTERNAL_SERVER_ERROR, "Failed to update subscription");
    return updatedSubscription;
};

export const cancelSubscription = async (subscriptionId: string, reason?: string) => {
    const subscription = await SubscriptionModel.findById(subscriptionId);
    AppAssert(subscription, NOT_FOUND, "Subscription not found");
    AppAssert(subscription.status === 'active', CONFLICT, "Only active subscriptions can be cancelled");

    const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
        subscriptionId,
        {
            status: 'cancelled',
            cancellationDate: new Date(),
            cancellationReason: reason
        },
        { new: true }
    )
    .populate('userId', 'name email')
    .populate('membershipPlanId', 'name price durationInDays category');

    return updatedSubscription;
};

export const pauseSubscription = async (subscriptionId: string, reason?: string) => {
    const subscription = await SubscriptionModel.findById(subscriptionId);
    AppAssert(subscription, NOT_FOUND, "Subscription not found");
    AppAssert(subscription.status === 'active', CONFLICT, "Only active subscriptions can be paused");

    const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
        subscriptionId,
        {
            status: 'paused',
            notes: reason ? `Paused: ${reason}` : 'Paused'
        },
        { new: true }
    )
    .populate('userId', 'name email')
    .populate('membershipPlanId', 'name price durationInDays category');

    return updatedSubscription;
};

export const resumeSubscription = async (subscriptionId: string) => {
    const subscription = await SubscriptionModel.findById(subscriptionId);
    AppAssert(subscription, NOT_FOUND, "Subscription not found");
    AppAssert(subscription.status === 'paused', CONFLICT, "Only paused subscriptions can be resumed");

    const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
        subscriptionId,
        {
            status: 'active',
            notes: 'Resumed'
        },
        { new: true }
    )
    .populate('userId', 'name email')
    .populate('membershipPlanId', 'name price durationInDays category');

    return updatedSubscription;
};

export const extendSubscription = async (subscriptionId: string, additionalDays: number) => {
    const subscription = await SubscriptionModel.findById(subscriptionId);
    AppAssert(subscription, NOT_FOUND, "Subscription not found");

    const newEndDate = new Date(subscription.endDate);
    newEndDate.setDate(newEndDate.getDate() + additionalDays);

    const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
        subscriptionId,
        { endDate: newEndDate },
        { new: true }
    )
    .populate('userId', 'name email')
    .populate('membershipPlanId', 'name price durationInDays category');

    return updatedSubscription;
};

export const deleteSubscription = async (subscriptionId: string) => {
    const subscription = await SubscriptionModel.findById(subscriptionId);
    AppAssert(subscription, NOT_FOUND, "Subscription not found");

    await SubscriptionModel.findByIdAndDelete(subscriptionId);
    return { message: "Subscription deleted successfully" };
};