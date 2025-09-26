import { Router } from "express";
import {
    updateStock,
    getLowStockItems,
    getMaintenanceAlerts,
    updateMaintenance
    // purchaseItem - uncomment when order flow is integrated
} from "../controllers/inventoryStock.controller.js";
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

// Stock management routes
router.put("/:id/stock", authenticate(['manager']), updateStock);           // Manager restocking
router.get("/low-stock", authenticate(['manager', 'staff']), getLowStockItems);      // Get low stock alerts
router.get("/maintenance-alerts", authenticate(['manager', 'staff']), getMaintenanceAlerts); // Get maintenance alerts
router.put("/:id/maintenance", authenticate(['manager']), updateMaintenance); // Update maintenance status

// Purchase route - COMMENTED OUT until order flow is integrated
// router.put("/:id/purchase", purchaseItem);    // Member purchasing (decrements stock)

export default router;