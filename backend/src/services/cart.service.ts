import Cart from "../models/cart.model.js";
import type { ICart } from "../models/cart.model.js";
import InventoryItem from "../models/inventoryItem.schema.js";
import mongoose from "mongoose";

export default class CartService {
  // Get cart by memberId
  async getCart(memberId: string): Promise<ICart | null> {
    return await Cart.findOne({ memberId }).populate("items.itemId");
  }

  // Add item to cart
  async addItem(memberId: string, itemId: string, quantity: number): Promise<ICart> {
    // Check if item exists and get stock quantity
    const item = await InventoryItem.findById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    let cart = await Cart.findOne({ memberId });

    if (!cart) {
      // Check stock for new cart
      if (quantity > item.quantity) {
        throw new Error(`Insufficient stock. Available: ${item.quantity}, Requested: ${quantity}`);
      }
      
      // If member has no cart yet, create one
      cart = new Cart({
        memberId: new mongoose.Types.ObjectId(memberId),
        items: [{ itemId: new mongoose.Types.ObjectId(itemId), quantity }],
      });
    } else {
      // If cart exists, check if item already in cart
      const itemIndex = cart.items.findIndex(
        (i) => i.itemId.toString() === itemId
      );

      if (itemIndex > -1) {
        // Check total quantity (existing + new) against stock
        const currentQuantityInCart = cart.items[itemIndex]!.quantity;
        const totalQuantity = currentQuantityInCart + quantity;
        
        if (totalQuantity > item.quantity) {
          throw new Error(`Insufficient stock. Available: ${item.quantity}, Already in cart: ${currentQuantityInCart}, Requested: ${quantity}`);
        }
        
        // Increment quantity if stock is sufficient
        cart.items[itemIndex]!.quantity = totalQuantity;
      } else {
        // Check stock for new item
        if (quantity > item.quantity) {
          throw new Error(`Insufficient stock. Available: ${item.quantity}, Requested: ${quantity}`);
        }
        
        // Otherwise push new item
        cart.items.push({ itemId: new mongoose.Types.ObjectId(itemId), quantity });
      }
    }

    return await cart.save();
  }

  // Update item quantity in cart
  async updateItem(memberId: string, itemId: string, quantity: number): Promise<ICart | null> {
    // Check if item exists and get stock quantity
    const item = await InventoryItem.findById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    // Check stock availability
    if (quantity > item.quantity) {
      throw new Error(`Insufficient stock. Available: ${item.quantity}, Requested: ${quantity}`);
    }

    const cart = await Cart.findOne({ memberId });
    if (!cart) return null;

    const itemIndex = cart.items.findIndex(
      (i) => i.itemId.toString() === itemId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex]!.quantity = quantity;
      return await cart.save();
    }
    return null;
  }

  // Remove specific item
  async removeItem(memberId: string, itemId: string): Promise<ICart | null> {
    const cart = await Cart.findOne({ memberId });
    if (!cart) return null;

    cart.items = cart.items.filter((i) => i.itemId.toString() !== itemId);

    return await cart.save();
  }

  // Clear entire cart
  async clearCart(memberId: string): Promise<ICart | null> {
    return await Cart.findOneAndUpdate(
      { memberId },
      { items: [] },
      { new: true }
    );
  }
}