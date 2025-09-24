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
router.put("/items/:id/stock", authenticate(['manager']), updateStock);           // Manager restocking
router.get("/items/low-stock", authenticate(['manager', 'staff']), getLowStockItems);      // Get low stock alerts
router.get("/items/maintenance-alerts", authenticate(['manager', 'staff']), getMaintenanceAlerts); // Get maintenance alerts
router.put("/items/:id/maintenance", authenticate(['manager']), updateMaintenance); // Update maintenance status

// Purchase route - COMMENTED OUT until order flow is integrated
// router.put("/items/:id/purchase", purchaseItem);    // Member purchasing (decrements stock)

export default router;