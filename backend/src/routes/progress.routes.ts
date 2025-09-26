import { Router } from "express";
import * as ProgressController from "../controllers/progress.controller.js";

// Import related route modules
import goalRoutes from "./goal.routes.js";
import workoutRoutes from "./workout.routes.js";
import nutritionRoutes from "./nutrition.routes.js";

const router = Router();

// ✅ Progress CRUD endpoints
router.post("/", ProgressController.createProgress);
router.get("/", ProgressController.getAllProgress);
router.get("/:id", ProgressController.getProgressById);
router.put("/:id", ProgressController.updateProgress);
router.delete("/:id", ProgressController.deleteProgress);

// ✅ Mount Goal, Workout, and Nutrition routes under /progress
router.use("/goals", goalRoutes);
router.use("/workouts", workoutRoutes);
router.use("/nutrition", nutritionRoutes);

export default router;

