import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import * as WorkoutService from "../services/workout.service.js";
import type { IWorkout } from "../models/workout.model.js";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

const workoutSchema = z.object({
  memberId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid member ID"),
  exercise: z.string().min(2, "Exercise name must be at least 2 characters").max(100, "Exercise name too long"),
  sets: z.number().int().min(1, "Sets must be at least 1").max(50, "Sets cannot exceed 50"),
  reps: z.number().int().min(1, "Reps must be at least 1").max(1000, "Reps cannot exceed 1000"),
  weight: z.number().min(0, "Weight cannot be negative").max(1000, "Weight cannot exceed 1000kg"),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  date: z.coerce.date()
});

export const createWorkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = workoutSchema.parse(req.body);
    const workout = await WorkoutService.createWorkout(validatedData as IWorkout);
    res.status(201).json({ success: true, data: workout });
  } catch (err) {
    next(err);
  }
};

export const getAllWorkouts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { memberId } = req.query;
    const list = memberId
      ? await WorkoutService.getWorkoutsByMember(memberId as string)
      : await WorkoutService.getAllWorkouts();
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

export const getWorkoutById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const workout = await WorkoutService.getWorkoutById(id);
    res.status(200).json({ success: true, data: workout });
  } catch (err) {
    next(err);
  }
};

export const updateWorkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = workoutSchema.partial().parse(req.body);
    const workout = await WorkoutService.updateWorkout(id, validatedData);
    res.status(200).json({ success: true, data: workout });
  } catch (err) {
    next(err);
  }
};

export const deleteWorkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await WorkoutService.deleteWorkout(id);
    res.status(200).json({ success: true, message: "Workout deleted successfully" });
  } catch (err) {
    next(err);
  }
};