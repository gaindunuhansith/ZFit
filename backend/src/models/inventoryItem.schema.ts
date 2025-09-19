import mongoose, { Document } from "mongoose";

export interface IInventoryItem extends Document {
    itemName: string;
    itemDescription: string;
    categoryID: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    supplierID: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const InventoryItemSchema = new mongoose.Schema<IInventoryItem>({
    itemName: {
        type: String,
        required: true
    },
    itemDescription: {
        type: String,
        required: true
    },
    categoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    supplierID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const InventoryItem = mongoose.model<IInventoryItem>("InventoryItem", InventoryItemSchema);

export default InventoryItem;