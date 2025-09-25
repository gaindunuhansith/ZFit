import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { 
    getAllMemberships, 
    getMembershipById, 
    getMembershipsByCategory, 
    createMembership,
    updateMembership,
    deleteMembership,
    getMembershipCategories
} from "../services/membership.service.js";
import { CREATED, OK } from "../constants/http.js";

// Zod validation schemas
const createMembershipSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be at most 100 characters")
        .trim(),
    description: z.string()
        .max(1000, "Description must be at most 1000 characters")
        .optional(),
    price: z.number()
        .min(0.01, "Price must be greater than 0"),
    currency: z.enum(["LKR", "USD"]).default("LKR"),
    durationInDays: z.number()
        .int()
        .min(1, "Duration must be at least 1 day"),
    category: z.enum(["weights", "crossfit", "yoga", "mma", "other"])
});

const updateMembershipSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be at most 100 characters")
        .trim()
        .optional(),
    description: z.string()
        .max(1000, "Description must be at most 1000 characters")
        .optional(),
    price: z.number()
        .min(0.01, "Price must be greater than 0")
        .optional(),
    currency: z.enum(["LKR", "USD"]).optional(),
    durationInDays: z.number()
        .int()
        .min(1, "Duration must be at least 1 day")
        .optional(),
    category: z.enum(["weights", "crossfit", "yoga", "mma", "other"]).optional()
});

const membershipIdSchema = z.string().min(1, "Membership ID is required");
const categorySchema = z.enum(["weights", "crossfit", "yoga", "mma", "other"]);

