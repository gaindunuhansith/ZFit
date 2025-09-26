import { Router } from "express";
import {
    getStockLevelsReport,
    getUsageTrendsReport
} from "../controllers/inventoryReport.controller.js";
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

// Report routes
router.get("/stock-levels", authenticate(['manager']), getStockLevelsReport);     // GET /api/v1/inventory/reports/stock-levels
router.get("/usage-trends", authenticate(['manager']), getUsageTrendsReport);     // GET /api/v1/inventory/reports/usage-trends

export default router;