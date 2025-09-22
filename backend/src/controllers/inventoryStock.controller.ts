import type { Request, Response } from "express";
import { z } from "zod";
import StockService from "../services/inventoryStock.service.js";

const stockService = new StockService();

// Schema to update stock
const updateStockSchema = z.object({
    quantity: z.number().min(1),
    operation: z.enum(["increment", "decrement"])
});

// Schema to update maintenance
const updateMaintenanceSchema = z.object({
    maintenanceStatus: z.enum(["good", "maintenance_required", "under_repair"]),
    lastMaintenanceDate: z.date().optional()
});

// Update stock (increment or decrement)
export const updateStock = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validate that id is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Item ID is required"
            });
        }

        const { quantity, operation } = updateStockSchema.parse(req.body);
        const item = await stockService.updateStock(id, quantity, operation);
        res.status(200).json({
            success: true,
            message: `Stock ${operation} successful`,
            data: item
        });
    } catch (error) {
        handleError(res, error);
    }
};

// Get low stock items
export const getLowStockItems = async (req: Request, res: Response) => {
    try {
        const items = await stockService.getLowStockItems();
        res.status(200).json({
            success: true,
            message: "Low stock items retrieved",
            data: items
        });
    } catch (error) {
        handleError(res, error);
    }
};

// Get maintenance alerts
export const getMaintenanceAlerts = async (req: Request, res: Response) => {
    try {
        const items = await stockService.getMaintenanceAlerts();
        res.status(200).json({
            success: true,
            message: "Maintenance alerts retrieved",
            data: items
        });
    } catch (error) {
        handleError(res, error);
    }
};

// Update maintenance status
export const updateMaintenance = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validate that id is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Item ID is required"
            });
        }

        const { maintenanceStatus, lastMaintenanceDate } = updateMaintenanceSchema.parse(req.body);
        const item = await stockService.updateMaintenance(id, maintenanceStatus, lastMaintenanceDate);
        res.status(200).json({
            success: true,
            message: "Maintenance updated successfully",
            data: item
        });
    } catch (error) {
        handleError(res, error);
    }
};

// Purchase item (decrement stock) - COMMENTED OUT until order flow is integrated
/*
const purchaseSchema = z.object({
    quantity: z.number().min(1)
});

export const purchaseItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // Validate that id is provided
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Item ID is required"
            });
        }

        const { quantity } = purchaseSchema.parse(req.body);
        
        // Decrement stock when item is purchased
        const item = await stockService.updateStock(id, quantity, "decrement");
        
        res.status(200).json({
            success: true,
            message: "Item purchased successfully",
            data: item
        });
    } catch (error) {
        handleError(res, error);
    }
};
*/

// Centralized error handler
const handleError = (res: Response, error: unknown) => {
    console.error("Error:", error);
    res.status(500).json({
        success: false,
        message: (error as Error).message || "Internal server error"
    });
};
