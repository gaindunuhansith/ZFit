import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import * as WorkoutService from "../services/workout.service.js";
import * as NutritionService from "../services/nutrition.service.js";
import * as GoalService from "../services/goal.service.js";
import * as ProgressService from "../services/progress.service.js";
import { generatePDFReport } from "../utils/pdfGenerator.js";
import { generateExcelReport } from "../utils/excelGenerator.js";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

const reportQuerySchema = z.object({
  memberId: objectId.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  format: z.enum(['pdf', 'excel']).default('pdf'),
  type: z.enum(['daily', 'weekly', 'monthly', 'yearly']).default('daily')
});

export const generateTrackingReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { memberId, startDate, endDate, format, type } = reportQuerySchema.parse(req.query);
    
    // Set date range based on type
    const now = new Date();
    let start: Date, end: Date;
    
    switch (type) {
      case 'daily':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        start = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
        start.setHours(0, 0, 0, 0);
        end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
        break;
      case 'monthly':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
      case 'yearly':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      default:
        start = new Date(startDate || now);
        end = new Date(endDate || now);
    }

    // Fetch data
    const [workouts, nutrition, goals, progress] = await Promise.all([
      memberId 
        ? WorkoutService.getWorkoutsByMember(memberId)
        : WorkoutService.getAllWorkouts(),
      memberId 
        ? NutritionService.getNutritionByMember(memberId)
        : NutritionService.getAllNutrition(),
      memberId 
        ? GoalService.getGoalsByMember(memberId)
        : GoalService.getAllGoals(),
      memberId 
        ? ProgressService.getProgressByMember(memberId)
        : ProgressService.getAllProgress()
    ]);

    // Filter data by date range
    const filteredWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.date);
      return workoutDate >= start && workoutDate <= end;
    });

    const filteredNutrition = nutrition.filter(n => {
      const nutritionDate = new Date(n.date);
      return nutritionDate >= start && nutritionDate <= end;
    });

    const filteredGoals = goals.filter(g => {
      if (g.deadline) {
        const goalDate = new Date(g.deadline);
        return goalDate >= start && goalDate <= end;
      }
      return true;
    });

    const filteredProgress = progress.filter(p => {
      const progressDate = new Date(p.date);
      return progressDate >= start && progressDate <= end;
    });

    // Prepare report data
    const reportData = {
      type,
      startDate: start,
      endDate: end,
      memberId,
      summary: {
        totalWorkouts: filteredWorkouts.length,
        totalCalories: filteredNutrition.reduce((sum, n) => sum + n.calories, 0),
        totalGoals: filteredGoals.length,
        completedGoals: filteredGoals.filter(g => g.deadline && new Date(g.deadline) <= now).length,
        averageWorkoutsPerDay: filteredWorkouts.length / Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)))
      },
      data: {
        workouts: filteredWorkouts,
        nutrition: filteredNutrition,
        goals: filteredGoals,
        progress: filteredProgress
      }
    };

    if (format === 'pdf') {
      const pdfBuffer = await generatePDFReport(reportData);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="tracking-report-${type}-${new Date().toISOString().split('T')[0]}.pdf"`);
      res.send(pdfBuffer);
    } else {
      const excelBuffer = await generateExcelReport(reportData);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="tracking-report-${type}-${new Date().toISOString().split('T')[0]}.xlsx"`);
      res.send(excelBuffer);
    }

  } catch (err) {
    next(err);
  }
};