import type { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";
import type { ZodSchema } from "zod";
import mongoose from "mongoose";

// -----------------------------
// Helper: ObjectId validator for Zod
// -----------------------------
const objectId = () =>
  z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid ObjectId" });

// -----------------------------
// Class (ClassSession) schemas
// -----------------------------
export const createClassSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  facilityId: objectId(),
  trainerId: objectId().optional(),
  startAt: z
    .preprocess((val) => (val ? new Date(val as string) : undefined), z.date())
    .optional(),
  endAt: z
    .preprocess((val) => (val ? new Date(val as string) : undefined), z.date())
    .optional(),
  capacity: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
});

export const updateClassSchema = createClassSchema.partial();
export type CreateClassInput = z.infer<typeof createClassSchema>;
export type UpdateClassInput = z.infer<typeof updateClassSchema>;

// -----------------------------
// Trainer schemas
// -----------------------------
export const createTrainerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  certifications: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional(),
});

export const updateTrainerSchema = createTrainerSchema.partial();
export type CreateTrainerInput = z.infer<typeof createTrainerSchema>;
export type UpdateTrainerInput = z.infer<typeof updateTrainerSchema>;

// -----------------------------
// Facility schemas
// -----------------------------
export const createFacilitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().optional(),
  capacity: z.number().int().nonnegative().optional(),
  equipments: z.array(z.string()).optional().default([]),
  openingHours: z
    .object({
      open: z.string().optional(), // e.g. "06:00"
      close: z.string().optional(),
    })
    .optional(),
  isActive: z.boolean().optional(),
});


export const updateFacilitySchema = createFacilitySchema.partial();
export type CreateFacilityInput = z.infer<typeof createFacilitySchema>;
export type UpdateFacilityInput = z.infer<typeof updateFacilitySchema>;



// -----------------------------
// Generic Express middleware
// -----------------------------
export const validateBody = (schema: ZodSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body); // throws on invalid
      req.body = validated;
      return next();
    } catch (err: any) {
      const errors =
        err.errors?.map((e: any) => ({
          path: e.path.join("."),
          message: e.message,
        })) || [{ message: err.message }];
      return res.status(400).json({ message: "Validation failed", errors });
    }
  };
};

// -----------------------------
// Bonus: ID param validator middleware (fixed)
// -----------------------------
export const validateIdParam =
  (paramName = "id"): RequestHandler =>
  (req, res, next) => {
    const val = req.params[paramName];
    if (!val || !mongoose.Types.ObjectId.isValid(String(val))) {
      return res.status(400).json({ message: `Invalid ${paramName}` });
    }
    next();
  };

// -----------------------------
// Notes
// -----------------------------
// - This file centralises Zod validation for Class/Trainer/Facility CRUD.
// - Use `validateBody(schema)` for POST/PATCH/PUT requests.
// - Use `validateIdParam("id")` for routes that require a MongoDB ObjectId.
// - Update schemas can accept partial data because of `.partial()`.
// - Dates are preprocessed into JS Date objects.
