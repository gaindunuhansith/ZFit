import { Router } from "express";
import {
    updateStock,
    getLowStockItems,
    getMaintenanceAlerts,
    updateMaintenance
    // purchaseItem - uncomment when order flow is integrated
} from "../controllers/inventoryStock.controller.js";

const router = Router();

// Stock management routes
router.put("/items/:id/stock", updateStock);           // Manager restocking
router.get("/items/low-stock", getLowStockItems);      // Get low stock alerts
router.get("/items/maintenance-alerts", getMaintenanceAlerts); // Get maintenance alerts
router.put("/items/:id/maintenance", updateMaintenance); // Update maintenance status

// Purchase route - COMMENTED OUT until order flow is integrated
// router.put("/items/:id/purchase", purchaseItem);    // Member purchasing (decrements stock)

export default router;