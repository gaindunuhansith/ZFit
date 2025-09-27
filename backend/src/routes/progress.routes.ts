import { Router } from "express";
import * as ProgressController from "../controllers/progress.controller.js";

const router = Router();

// ✅ Progress CRUD endpoints
router.post("/", ProgressController.createProgress);
router.get("/", ProgressController.getAllProgress);
router.get("/:id", ProgressController.getProgressById);
router.put("/:id", ProgressController.updateProgress);
router.delete("/:id", ProgressController.deleteProgress);

export default router;




