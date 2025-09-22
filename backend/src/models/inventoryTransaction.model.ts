import mongoose, { Document } from "mongoose";

interface IInventoryTransaction extends Document {
    itemID: mongoose.Types.ObjectId;
    transactionType: "increment" | "decrement";
    quantityChanged: number;
    date: Date;
}

const inventoryTransactionSchema = new mongoose.Schema({
    itemID: { type: mongoose.Schema.Types.ObjectId, ref: "InventoryItem", required: true },
    transactionType: { type: String, enum: ["increment", "decrement"], required: true },
    quantityChanged: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const InventoryTransaction = mongoose.model<IInventoryTransaction>("InventoryTransaction", inventoryTransactionSchema);
export default InventoryTransaction;