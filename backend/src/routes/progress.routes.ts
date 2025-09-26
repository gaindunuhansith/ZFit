import { Router } from "express";
import goalRoutes from "./goal.routes.js";
import nutritionRoutes from "./nutrition.routes.js";
import workoutRoutes from "./workout.routes.js";

const router = Router();

// Group all progress-related routes here
router.use("/goals", goalRoutes);
router.use("/nutrition", nutritionRoutes);
router.use("/workouts", workoutRoutes);

export default router;


