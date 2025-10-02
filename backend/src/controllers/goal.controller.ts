import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as GoalService from "../services/goal.service.js";
import type { IGoal } from "../models/goal.model.js";

const goalSchema = z.object({
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid member ID"),
  goalType: z.enum(["weight_loss", "weight_gain", "muscle_gain", "strength", "endurance", "flexibility", "other"], { required_error: "Goal type is required" }),
  target: z.string().min(5, "Target description must be at least 5 characters").max(500, "Target description too long"),
  deadline: z.coerce.date().optional(),
  assignedBy: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid assigned by ID").optional()
});

export const createGoal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = goalSchema.parse(req.body);
    const goal = await GoalService.createGoal(validatedData as IGoal);
    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
};

export const getAllGoals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { memberId } = req.query;
    const list = memberId
      ? await GoalService.getGoalsByMember(memberId as string)
      : await GoalService.getAllGoals();
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

export const getGoalById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const goal = await GoalService.getGoalById(id);
    res.status(200).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
};

export const updateGoal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = goalSchema.partial().parse(req.body);
    const goal = await GoalService.updateGoal(id, validatedData);
    res.status(200).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
};

export const deleteGoal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await GoalService.deleteGoal(id);
    res.status(200).json({ success: true, message: "Goal deleted successfully" });
  } catch (err) {
    next(err);
  }
};