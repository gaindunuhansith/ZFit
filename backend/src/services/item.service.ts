import InventoryItem, { type IInventoryItem } from "../models/inventoryItem.schema.js";
import Category from "../models/category.model.js";
import AppError from "../util/AppError.js";
import { BAD_REQUEST, NOT_FOUND, CONFLICT } from "../constants/http.js";
import mongoose from "mongoose";

export interface CreateItemData {
  name: string;
  categoryID: string;
  type: "sellable" | "equipment";
  
  // Sellable fields
  price?: number | undefined;
  stock?: number | undefined;
  expiryDate?: string | undefined;
  lowStockAlert?: number | undefined;
  
  // Equipment fields
  purchaseDate?: string | undefined;
  maintenanceSchedule?: string | undefined;
  warrantyPeriod?: string | undefined;
}

export interface UpdateItemData {
  name?: string | undefined;
  categoryID?: string | undefined;
  type?: "sellable" | "equipment" | undefined;
  
  // Sellable fields
  price?: number | undefined;
  stock?: number | undefined;
  expiryDate?: string | undefined;
  lowStockAlert?: number | undefined;
  
  // Equipment fields
  purchaseDate?: string | undefined;
  maintenanceSchedule?: string | undefined;
  warrantyPeriod?: string | undefined;
}

class ItemService {
  // CREATE - Add new item
  async createItem(data: CreateItemData): Promise<IInventoryItem> {
    try {
      // Validate category exists
      const category = await Category.findById(data.categoryID);
      if (!category) {
        throw new AppError(BAD_REQUEST, "Category not found");
      }

      // Check for duplicate name within the same category
      const existingItem = await InventoryItem.findOne({
        name: data.name.trim(),
        categoryID: data.categoryID,
        isActive: true
      });

      if (existingItem) {
        throw new AppError(CONFLICT, "An item with this name already exists in the selected category");
      }

      // Prepare item data
      const itemData: any = {
        name: data.name.trim(),
        categoryID: data.categoryID,
        type: data.type,
        isActive: true
      };

      // Add type-specific fields
      if (data.type === 'sellable') {
        itemData.price = data.price;
        itemData.stock = data.stock;
        if (data.expiryDate) itemData.expiryDate = new Date(data.expiryDate);
        if (data.lowStockAlert) itemData.lowStockAlert = data.lowStockAlert;
      } else if (data.type === 'equipment') {
        if (data.purchaseDate) itemData.purchaseDate = new Date(data.purchaseDate);
        if (data.maintenanceSchedule) itemData.maintenanceSchedule = data.maintenanceSchedule;
        if (data.warrantyPeriod) itemData.warrantyPeriod = data.warrantyPeriod;
      }

      const item = new InventoryItem(itemData);
      return await item.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError(CONFLICT, "An item with this name already exists in the selected category");
      }
      throw error;
    }
  }

  // READ - Get all items with optional category filter
  async getAllItems(categoryID?: string): Promise<IInventoryItem[]> {
    const filter: any = { isActive: true };
    
    if (categoryID) {
      if (!mongoose.Types.ObjectId.isValid(categoryID)) {
        throw new AppError(BAD_REQUEST, "Invalid category ID format");
      }
      filter.categoryID = categoryID;
    }

    return await InventoryItem.find(filter)
      .populate('categoryID', 'name description')
      .sort({ createdAt: -1 });
  }

  // READ - Get single item by ID
  async getItemById(id: string): Promise<IInventoryItem | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(BAD_REQUEST, "Invalid item ID format");
    }

    return await InventoryItem.findOne({ _id: id, isActive: true })
      .populate('categoryID', 'name description');
  }

  // UPDATE - Update existing item
  async updateItem(id: string, data: UpdateItemData): Promise<IInventoryItem | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError(BAD_REQUEST, "Invalid item ID format");
      }

      // Check if item exists
      const existingItem = await InventoryItem.findOne({ _id: id, isActive: true });
      if (!existingItem) {
        throw new AppError(NOT_FOUND, "Item not found");
      }

      // If updating category, validate it exists
      if (data.categoryID) {
        const category = await Category.findById(data.categoryID);
        if (!category) {
          throw new AppError(BAD_REQUEST, "Category not found");
        }
      }

      // Check for duplicate name within category (if name or category is being updated)
      if (data.name || data.categoryID) {
        const checkName = data.name?.trim() || existingItem.name;
        const checkCategoryID = data.categoryID || existingItem.categoryID.toString();

        const duplicateItem = await InventoryItem.findOne({
          _id: { $ne: id },
          name: checkName,
          categoryID: checkCategoryID,
          isActive: true
        });

        if (duplicateItem) {
          throw new AppError(CONFLICT, "An item with this name already exists in the selected category");
        }
      }

      // Prepare update data
      const updateData: any = {};
      
      if (data.name) updateData.name = data.name.trim();
      if (data.categoryID) updateData.categoryID = data.categoryID;
      if (data.type) updateData.type = data.type;

      // Handle type-specific fields based on the type being set (new or existing)
      const itemType = data.type || existingItem.type;

      if (itemType === 'sellable') {
        // Update sellable fields
        if (data.price !== undefined) updateData.price = data.price;
        if (data.stock !== undefined) updateData.stock = data.stock;
        if (data.expiryDate) updateData.expiryDate = new Date(data.expiryDate);
        if (data.lowStockAlert !== undefined) updateData.lowStockAlert = data.lowStockAlert;

        // Remove equipment fields if switching types
        if (data.type === 'sellable') {
          updateData.purchaseDate = undefined;
          updateData.maintenanceSchedule = undefined;
          updateData.warrantyPeriod = undefined;
        }
      } else if (itemType === 'equipment') {
        // Update equipment fields
        if (data.purchaseDate) updateData.purchaseDate = new Date(data.purchaseDate);
        if (data.maintenanceSchedule !== undefined) updateData.maintenanceSchedule = data.maintenanceSchedule;
        if (data.warrantyPeriod !== undefined) updateData.warrantyPeriod = data.warrantyPeriod;

        // Remove sellable fields if switching types
        if (data.type === 'equipment') {
          updateData.price = undefined;
          updateData.stock = undefined;
          updateData.expiryDate = undefined;
          updateData.lowStockAlert = undefined;
        }
      }

      return await InventoryItem.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('categoryID', 'name description');
    } catch (error: any) {
      if (error.code === 11000) {
        throw new AppError(CONFLICT, "An item with this name already exists in the selected category");
      }
      throw error;
    }
  }

  // DELETE - Soft delete item
  async deleteItem(id: string): Promise<IInventoryItem | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(BAD_REQUEST, "Invalid item ID format");
    }

    const item = await InventoryItem.findOne({ _id: id, isActive: true });
    if (!item) {
      throw new AppError(NOT_FOUND, "Item not found");
    }

    return await InventoryItem.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  }

  // UTILITY - Get items by category (for category deletion validation)
  async getItemsCountByCategory(categoryID: string): Promise<number> {
    return await InventoryItem.countDocuments({
      categoryID: categoryID,
      isActive: true
    });
  }
}

export default ItemService;