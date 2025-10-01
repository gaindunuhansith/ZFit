import { Router } from "express";
import * as ReportController from "../controllers/report.controller.js";

const router = Router();

// Report generation endpoints
router.get("/tracking", ReportController.generateTrackingReport);

export default router;