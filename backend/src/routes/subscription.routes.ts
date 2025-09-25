import { Router } from "express";
import {
    getAllSubscriptionsHandler,
    getSubscriptionByIdHandler,
    getUserSubscriptionsHandler,
    getActiveSubscriptionsHandler,
    getExpiringSubscriptionsHandler,
    getUserActiveSubscriptionHandler,
    createSubscriptionHandler,
    updateSubscriptionHandler,
    cancelSubscriptionHandler,
    pauseSubscriptionHandler,
    resumeSubscriptionHandler,
    extendSubscriptionHandler,
    deleteSubscriptionHandler
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// GET routes
subscriptionRouter.get("/", getAllSubscriptionsHandler);
subscriptionRouter.get("/active", getActiveSubscriptionsHandler);
subscriptionRouter.get("/expiring", getExpiringSubscriptionsHandler);
subscriptionRouter.get("/user/:userId", getUserSubscriptionsHandler);
subscriptionRouter.get("/user/:userId/active", getUserActiveSubscriptionHandler);
subscriptionRouter.get("/:id", getSubscriptionByIdHandler);

// POST routes
subscriptionRouter.post("/", createSubscriptionHandler);

// PUT routes
subscriptionRouter.put("/:id", updateSubscriptionHandler);

// PATCH routes
subscriptionRouter.patch("/:id/cancel", cancelSubscriptionHandler);
subscriptionRouter.patch("/:id/pause", pauseSubscriptionHandler);
subscriptionRouter.patch("/:id/resume", resumeSubscriptionHandler);
subscriptionRouter.patch("/:id/extend", extendSubscriptionHandler);

// DELETE routes
subscriptionRouter.delete("/:id", deleteSubscriptionHandler);

export default subscriptionRouter;