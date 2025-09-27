import mongoose, { Document } from "mongoose";

export interface IInventoryItem extends Document {
    itemName: string;
    itemDescription: string;
    categoryID: "supplements" | "equipment";
    quantity: number;
    price: number;
    supplierID: mongoose.Types.ObjectId;
    lowStockThreshold: number;
    maintenanceStatus: "good" | "maintenance_required" | "under_repair";
    lastMaintenanceDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const InventoryItemSchema = new mongoose.Schema<IInventoryItem>({
    itemName: { type: String, required: true},
    itemDescription: { type: String, required: true},
    categoryID: { 
        type: String, 
        enum: ["supplements", "equipment"], 
        required: true 
    },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    supplierID: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    lowStockThreshold: { type: Number, default: 5 },
    maintenanceStatus: { 
        type: String, 
        enum: ["good", "maintenance_required", "under_repair"], 
        default: "good" 
    },
    lastMaintenanceDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const InventoryItem = mongoose.model<IInventoryItem>("InventoryItem", InventoryItemSchema);

export default InventoryItem;