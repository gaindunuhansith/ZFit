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

subscriptionRouter.get("/", getAllSubscriptionsHandler);
subscriptionRouter.get("/active", getActiveSubscriptionsHandler);
subscriptionRouter.get("/expiring", getExpiringSubscriptionsHandler);
subscriptionRouter.get("/user/:userId", getUserSubscriptionsHandler);
subscriptionRouter.get("/user/:userId/active", getUserActiveSubscriptionHandler);
subscriptionRouter.get("/:id", getSubscriptionByIdHandler);

subscriptionRouter.post("/", createSubscriptionHandler);

subscriptionRouter.put("/:id", updateSubscriptionHandler);

subscriptionRouter.patch("/:id/cancel", cancelSubscriptionHandler);
subscriptionRouter.patch("/:id/pause", pauseSubscriptionHandler);
subscriptionRouter.patch("/:id/resume", resumeSubscriptionHandler);
subscriptionRouter.patch("/:id/extend", extendSubscriptionHandler);

subscriptionRouter.delete("/:id", deleteSubscriptionHandler);

export default subscriptionRouter;