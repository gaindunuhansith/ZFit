import { Router } from "express";
import {
    checkout,
    getMemberOrders
} from "../controllers/order.controller.js";
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

// Order routes
router.post("/checkout/:memberId", authenticate(), checkout);        // POST /api/v1/orders/checkout/{memberId}
router.get("/member/:memberId", authenticate(), getMemberOrders);    // GET /api/v1/orders/member/{memberId}

export default router;