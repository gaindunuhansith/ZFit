import type { Request, Response } from "express";
import { z } from "zod";
import SupplierService from "../services/inventorySupplier.service.js";

const supplierService = new SupplierService();

export const createSupplierSchema = z.object({
  supplierName: z.string().min(1, "Supplier name is required"),
  supplierEmail: z.string().email("Invalid email address"),
  supplierPhone: z.string().min(5, "Phone number is required"),
  supplierAddress: z.string().min(1, "Address is required"),
});

export const updateSupplierSchema = z.object({
  supplierName: z.string().min(1, "Supplier name is required").optional(),
  supplierEmail: z.string().email("Invalid email address").optional(),
  supplierPhone: z.string().min(5, "Phone number is required").optional(),
  supplierAddress: z.string().min(1, "Address is required").optional(),
});

const categoryIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID format"),
});

