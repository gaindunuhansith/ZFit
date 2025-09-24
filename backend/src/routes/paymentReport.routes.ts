import express from 'express';
import {
    getRevenueReport,
    getPaymentHistoryReport,
    getRefundReport,
    getRevenueByModuleReport,
    getPaymentTrends,
    getRevenueByModuleAnalytics,
    getRefundStatisticsAnalytics,
    getDailyRevenueSummary
} from '../controllers/paymentReport.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = express.Router();

// Test route without authentication
router.get('/test', (req, res) => {
    res.json({ success: true, message: 'Payment reports route is working' });
});

// Apply authentication middleware to all report routes (admin role required)
router.use(authenticate(['admin']));

// === REPORTS ENDPOINTS ===
/**
 * @route GET /api/v1/reports/revenue
 * @desc Get revenue report for a date range
 * @query startDate, endDate (required) - YYYY-MM-DD format
 * @access Private (Admin)
 */
router.get('/revenue', getRevenueReport);

/**
 * @route GET /api/v1/reports/payments
 * @desc Get payment history with filters
 * @query userId, type, status, startDate, endDate, page, limit (optional)
 * @access Private (Admin)
 */
router.get('/payments', getPaymentHistoryReport);

/**
 * @route GET /api/v1/reports/refunds
 * @desc Get refund statistics for a date range
 * @query startDate, endDate (required) - YYYY-MM-DD format
 * @access Private (Admin)
 */
router.get('/refunds', getRefundReport);

/**
 * @route GET /api/v1/reports/revenue-by-module
 * @desc Get revenue breakdown by module (membership, inventory, etc.)
 * @query startDate, endDate (required) - YYYY-MM-DD format
 * @access Private (Admin)
 */
router.get('/revenue-by-module', getRevenueByModuleReport);

/**
 * @route GET /api/v1/reports/daily-summary
 * @desc Get revenue summary for a specific date
 * @query date (required) - YYYY-MM-DD format
 * @access Private (Admin)
 */
router.get('/daily-summary', getDailyRevenueSummary);

// === ANALYTICS ENDPOINTS ===
/**
 * @route GET /api/v1/analytics/payment-trends
 * @desc Get payment trends over time
 * @query startDate, endDate (required), groupBy (optional: day/week/month)
 * @access Private (Admin)
 */
router.get('/payment-trends', getPaymentTrends);

/**
 * @route GET /api/v1/analytics/revenue-by-module
 * @desc Get revenue analytics by module
 * @query startDate, endDate (required)
 * @access Private (Admin)
 */
router.get('/revenue-by-module-analytics', getRevenueByModuleAnalytics);

/**
 * @route GET /api/v1/analytics/refund-statistics
 * @desc Get refund statistics analytics
 * @query startDate, endDate (required)
 * @access Private (Admin)
 */
router.get('/refund-statistics', getRefundStatisticsAnalytics);

export default router;