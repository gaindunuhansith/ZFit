import type { Request, Response, NextFunction } from "express";
import OrderService from "../services/order.service.js";
import Order from "../models/orders.model.js";

const orderService = new OrderService();

// Checkout
export const checkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { memberId } = req.params;
    
    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Member ID is required",
      });
    }
    
    const order = await orderService.checkout(memberId);

    res.status(201).json({
      success: true,
      message: "Checkout completed successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Get member orders
export const getMemberOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { memberId } = req.params;
    
    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Member ID is required",
      });
    }
    
    const orders = await Order.find({ memberId });
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};