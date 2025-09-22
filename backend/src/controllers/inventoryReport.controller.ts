import type { Request, Response } from "express";
import ReportService from "../services/reportService.js";

// Create an instance of the service
const reportService = new ReportService();

// Get stock levels report
export const getStockLevelsReport = async (req: Request, res: Response) => {
    try {
        const report = await reportService.getStockLevels();
        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};

// Get usage trends report
export const getUsageTrendsReport = async (req: Request, res: Response) => {
    try {
        const report = await reportService.getUsageTrends();
        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};