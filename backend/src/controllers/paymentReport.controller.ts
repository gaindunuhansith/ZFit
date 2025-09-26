import type { Request, Response } from 'express';
import { PaymentReportService } from '../services/paymentReport.service.js';
import type { DateRange } from '../services/paymentReport.service.js';

const paymentReportService = new PaymentReportService();

/**
 * Get revenue report
 * GET /api/v1/reports/revenue
 */
export const getRevenueReport = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'startDate and endDate are required'
            });
        }

        const dateRange: DateRange = {
            startDate: new Date(startDate as string),
            endDate: new Date(endDate as string)
        };

        // Validate dates
        if (isNaN(dateRange.startDate.getTime()) || isNaN(dateRange.endDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        if (dateRange.startDate > dateRange.endDate) {
            return res.status(400).json({
                success: false,
                message: 'startDate cannot be later than endDate'
            });
        }

        const report = await paymentReportService.getRevenueReport(dateRange);

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Revenue report error:', error);
        res.status(500).json({
            success: false,
            message: `Failed to generate revenue report: ${(error as Error).message}`
        });
    }
};

/**
 * Get payment history report
 * GET /api/v1/reports/payments
 */
export const getPaymentHistoryReport = async (req: Request, res: Response) => {
    try {
        const {
            userId,
            type,
            status,
            startDate,
            endDate,
            page = '1',
            limit = '50'
        } = req.query;

        const filters: any = {
            page: parseInt(page as string),
            limit: Math.min(parseInt(limit as string), 100) // Max 100 per page
        };

        if (userId) filters.userId = userId as string;
        if (type) filters.type = type as string;
        if (status) filters.status = status as string;
        if (startDate) filters.startDate = new Date(startDate as string);
        if (endDate) filters.endDate = new Date(endDate as string);

        // Validate dates if provided
        if (filters.startDate && isNaN(filters.startDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid startDate format. Use YYYY-MM-DD'
            });
        }

        if (filters.endDate && isNaN(filters.endDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid endDate format. Use YYYY-MM-DD'
            });
        }

        const report = await paymentReportService.getPaymentHistory(filters);

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Payment history report error:', error);
        res.status(500).json({
            success: false,
            message: `Failed to generate payment history report: ${(error as Error).message}`
        });
    }
};

/**
 * Get refund statistics report
 * GET /api/v1/reports/refunds
 */
export const getRefundReport = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'startDate and endDate are required'
            });
        }

        const dateRange: DateRange = {
            startDate: new Date(startDate as string),
            endDate: new Date(endDate as string)
        };

        // Validate dates
        if (isNaN(dateRange.startDate.getTime()) || isNaN(dateRange.endDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        const report = await paymentReportService.getRefundStatistics(dateRange);

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Refund report error:', error);
        res.status(500).json({
            success: false,
            message: `Failed to generate refund report: ${(error as Error).message}`
        });
    }
};

/**
 * Get revenue by module report
 * GET /api/v1/reports/revenue-by-module
 */
export const getRevenueByModuleReport = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'startDate and endDate are required'
            });
        }

        const dateRange: DateRange = {
            startDate: new Date(startDate as string),
            endDate: new Date(endDate as string)
        };

        // Validate dates
        if (isNaN(dateRange.startDate.getTime()) || isNaN(dateRange.endDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        const report = await paymentReportService.getRevenueByModule(dateRange);

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Revenue by module report error:', error);
        res.status(500).json({
            success: false,
            message: `Failed to generate revenue by module report: ${(error as Error).message}`
        });
    }
};

/**
 * Get payment trends analytics
 * GET /api/v1/analytics/payment-trends
 */
export const getPaymentTrends = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, groupBy = 'day' } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'startDate and endDate are required'
            });
        }

        if (!['day', 'week', 'month'].includes(groupBy as string)) {
            return res.status(400).json({
                success: false,
                message: 'groupBy must be one of: day, week, month'
            });
        }

        const dateRange: DateRange = {
            startDate: new Date(startDate as string),
            endDate: new Date(endDate as string)
        };

        // Validate dates
        if (isNaN(dateRange.startDate.getTime()) || isNaN(dateRange.endDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        const trends = await paymentReportService.getPaymentTrends(
            dateRange, 
            groupBy as 'day' | 'week' | 'month'
        );

        res.status(200).json({
            success: true,
            data: trends
        });
    } catch (error) {
        console.error('Payment trends error:', error);
        res.status(500).json({
            success: false,
            message: `Failed to get payment trends: ${(error as Error).message}`
        });
    }
};

/**
 * Get revenue by module analytics
 * GET /api/v1/analytics/revenue-by-module
 */
export const getRevenueByModuleAnalytics = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'startDate and endDate are required'
            });
        }

        const dateRange: DateRange = {
            startDate: new Date(startDate as string),
            endDate: new Date(endDate as string)
        };

        // Validate dates
        if (isNaN(dateRange.startDate.getTime()) || isNaN(dateRange.endDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        const analytics = await paymentReportService.getRevenueByModule(dateRange);

        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        console.error('Revenue by module analytics error:', error);
        res.status(500).json({
            success: false,
            message: `Failed to get revenue analytics: ${(error as Error).message}`
        });
    }
};

/**
 * Get refund statistics analytics
 * GET /api/v1/analytics/refund-statistics
 */
export const getRefundStatisticsAnalytics = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'startDate and endDate are required'
            });
        }

        const dateRange: DateRange = {
            startDate: new Date(startDate as string),
            endDate: new Date(endDate as string)
        };

        // Validate dates
        if (isNaN(dateRange.startDate.getTime()) || isNaN(dateRange.endDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        const statistics = await paymentReportService.getRefundStatistics(dateRange);

        res.status(200).json({
            success: true,
            data: statistics
        });
    } catch (error) {
        console.error('Refund statistics analytics error:', error);
        res.status(500).json({
            success: false,
            message: `Failed to get refund statistics: ${(error as Error).message}`
        });
    }
};

/**
 * Get daily revenue summary
 * GET /api/v1/reports/daily-summary
 */
export const getDailyRevenueSummary = async (req: Request, res: Response) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'date is required (YYYY-MM-DD format)'
            });
        }

        const targetDate = new Date(date as string);

        // Validate date
        if (isNaN(targetDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use YYYY-MM-DD'
            });
        }

        const summary = await paymentReportService.getDailyRevenueSummary(targetDate);

        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('Daily revenue summary error:', error);
        res.status(500).json({
            success: false,
            message: `Failed to get daily revenue summary: ${(error as Error).message}`
        });
    }
};