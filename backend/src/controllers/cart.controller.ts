import type { Request, Response } from "express";
import { z } from "zod";
import CartService from "../services/cart.service.js";

// create an instance of the service
const cartService = new CartService();

// Zod validation schemas
const addToCartSchema = z.object({
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid member ID format"),
  itemId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid item ID format"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

const updateCartSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

const cartIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid cart ID format"),
});



//  Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const validated = addToCartSchema.parse(req.body);
    const cartItem = await cartService.addItem(validated.memberId, validated.itemId, validated.quantity);

    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: cartItem,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// 2. Get all cart items for a member
export const getCartByMember = async (req: Request, res: Response) => {
  try {
    const { memberId } = z.object({ memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid member ID format") }).parse(req.params);
    const cart = await cartService.getCart(memberId);

    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: "Cart not found",
        data: { items: [] }
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart items retrieved successfully",
      data: cart,
      count: cart.items.length,
    });
  } catch (error) {
    handleError(res, error);
  }
};

//  Update cart item quantity
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { memberId, itemId } = z.object({ 
      memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid member ID format"),
      itemId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid item ID format")
    }).parse(req.params);
    const validated = updateCartSchema.parse(req.body);

    const updatedCart = await cartService.updateItem(memberId, itemId, validated.quantity);
    if (!updatedCart) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: updatedCart,
    });
  } catch (error) {
    handleError(res, error);
  }
};

//  Remove cart item
export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const { memberId, itemId } = z.object({ 
      memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid member ID format"),
      itemId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid item ID format")
    }).parse(req.params);
    
    const updatedCart = await cartService.removeItem(memberId, itemId);

    if (!updatedCart) {
      return res.status(404).json({ success: false, message: "Cart item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
      data: updatedCart,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Clear cart for a member
export const clearCart = async (req: Request, res: Response) => {
  try {
    const { memberId } = z.object({ memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid member ID format") }).parse(req.params);
    const clearedCart = await cartService.clearCart(memberId);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: clearedCart,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Centralized error handler
const handleError = (res: Response, error: unknown) => {
  console.error("Error:", error);

  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};