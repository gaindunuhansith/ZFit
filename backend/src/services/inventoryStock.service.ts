import Item from "../models/inventoryItem.schema.js";
import type{ IInventoryItem } from "../models/inventoryItem.schema.js";
import mongoose from "mongoose";


export default class StockService {

    async updateStock(itemId: string, quantity: number, operation: "increment" | "decrement"): Promise<IInventoryItem | null> {
        const item = await Item.findById(itemId);
        
        if (!item) throw new Error("Item not found");

        if (operation === "increment") {
            item.quantity += quantity;
        } else if (operation === "decrement") {
            if (item.quantity < quantity) {
                throw new Error("Not enough stock");
            }
            item.quantity -= quantity;
        }
        
        item.updatedAt = new Date();
        return await item.save();
    }

    async getLowStockItems(): Promise<IInventoryItem[]> {
        return await Item.find({ $expr: { $lt: ["$quantity", "$lowStockThreshold"] } }).populate("categoryID").populate("supplierID");
    }

    async getMaintenanceAlerts(): Promise<IInventoryItem[]> {
        return await Item.find({
            maintenanceStatus: { $in: ["maintenance_required", "under_repair"] }
        }).populate("categoryID").populate("supplierID");
    } 

        async updateMaintenance(
        itemId: string,
        maintenanceStatus: "good" | "maintenance_required" | "under_repair",
        lastMaintenanceDate?: Date
    ): Promise<IInventoryItem | null> {
        const item = await Item.findById(itemId);
        if (!item) throw new Error("Item not found");

        item.maintenanceStatus = maintenanceStatus;
        if (lastMaintenanceDate) {
            item.lastMaintenanceDate = lastMaintenanceDate;
        }
        item.updatedAt = new Date();
        return await item.save();
    }


}