import InventoryItem from "../models/inventoryItem.schema.js";
import InventoryTransaction from "../models/inventoryTransaction.model.js";

export default class ReportService {

  async getStockLevels() {
    const items = await InventoryItem.find()
      .populate("categoryID", "categoryName")
      .populate("supplierID", "supplierName");

    return items.map(item => ({
      name: item.itemName,
      category: item.categoryID,
      supplier: item.supplierID,
      quantity: item.quantity,
      lowStock: item.quantity < item.lowStockThreshold
    }));
  }

  async getUsageTrends(): Promise<any[]> {
    return await InventoryTransaction.find()
      .populate("itemID", "itemName")
      .sort({ date: -1 });
  }
}