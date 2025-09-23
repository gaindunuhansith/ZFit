import type { Request, Response } from 'express';
import reportPaymentService from '../services/reportPayment.service.js';

export const getRevenueReport = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, module } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
        }

        const report = await reportPaymentService.getRevenueByModule(start, end, module as string);

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

export const getPaymentTrends = async (req: Request, res: Response) => {
    try {
        const { period, startDate, endDate } = req.query;

        if (!period || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Period, start date, and end date are required'
            });
        }

        const validPeriods = ['daily', 'monthly', 'yearly'];
        if (!validPeriods.includes(period as string)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid period. Must be daily, monthly, or yearly'
            });
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
        }

        const trends = await reportPaymentService.getPaymentTrends(
            period as 'daily' | 'monthly' | 'yearly',
            start,
            end
        );

        res.status(200).json({
            success: true,
            data: trends
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};

export const getRefundReport = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
        }

        const report = await reportPaymentService.getRefundStatistics(start, end);

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

export const getTransactionSummary = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, type, status, method } = req.query;

        const filters: any = {};

        if (startDate && endDate) {
            filters.startDate = new Date(startDate as string);
            filters.endDate = new Date(endDate as string);

            if (isNaN(filters.startDate.getTime()) || isNaN(filters.endDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format'
                });
            }
        }

        if (type) filters.type = type;
        if (status) filters.status = status;
        if (method) filters.method = method;

        const summary = await reportPaymentService.getTransactionSummary(filters);

        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error as Error).message
        });
    }
};

export const getTopRevenueSources = async (req: Request, res: Response) => {
    try {
        const { limit, startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Start date and end date are required'
            });
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);
        const limitNum = limit ? parseInt(limit as string) : 10;

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format'
            });
        }

        if (limitNum < 1 || limitNum > 100) {
            return res.status(400).json({
                success: false,
                message: 'Limit must be between 1 and 100'
            });
        }

        const report = await reportPaymentService.getTopRevenueSources(limitNum, start, end);

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