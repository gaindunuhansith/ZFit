import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as NutritionService from "../services/nutrition.service.js";
import type { INutrition } from "../models/nutrition.model.js";

const nutritionSchema = z.object({
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid member ID"),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"], { required_error: "Meal type is required" }),
  calories: z.number().int().min(0, "Calories cannot be negative").max(10000, "Calories cannot exceed 10,000"),
  macros: z.object({
    protein: z.number().min(0, "Protein cannot be negative").max(1000, "Protein cannot exceed 1000g").optional(),
    carbs: z.number().min(0, "Carbs cannot be negative").max(1000, "Carbs cannot exceed 1000g").optional(),
    fats: z.number().min(0, "Fats cannot be negative").max(1000, "Fats cannot exceed 1000g").optional()
  }).optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  date: z.coerce.date()
});

export const createNutrition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = nutritionSchema.parse(req.body);
    const nutrition = await NutritionService.createNutrition(validatedData as INutrition);
    res.status(201).json({ success: true, data: nutrition });
  } catch (err) {
    next(err);
  }
};

export const getAllNutrition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { memberId } = req.query;
    const list = memberId
      ? await NutritionService.getNutritionByMember(memberId as string)
      : await NutritionService.getAllNutrition();
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

export const getNutritionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const nutrition = await NutritionService.getNutritionById(id);
    res.status(200).json({ success: true, data: nutrition });
  } catch (err) {
    next(err);
  }
};

export const updateNutrition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = nutritionSchema.partial().parse(req.body);
    const nutrition = await NutritionService.updateNutrition(id, validatedData);
    res.status(200).json({ success: true, data: nutrition });
  } catch (err) {
    next(err);
  }
};

export const deleteNutrition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await NutritionService.deleteNutrition(id);
    res.status(200).json({ success: true, message: "Nutrition entry deleted successfully" });
  } catch (err) {
    next(err);
  }
};