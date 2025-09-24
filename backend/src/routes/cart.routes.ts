import { Router } from "express";
import {
    addToCart,
    getCartByMember,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../controllers/cart.controller.js";
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

// Cart routes
router.get("/:memberId",authenticate(), getCartByMember);           // GET /api/v1/cart/{memberId}
router.post("/items", authenticate(), addToCart);                    // POST /api/v1/cart/items
router.put("/:memberId/items/:itemId", authenticate(), updateCartItem);  // PUT /api/v1/cart/{memberId}/items/{itemId}
router.delete("/:memberId/items/:itemId", authenticate(), removeCartItem); // DELETE /api/v1/cart/{memberId}/items/{itemId}
router.delete("/:memberId/clear", authenticate(), clearCart);        // DELETE /api/v1/cart/{memberId}/clear

export default router;