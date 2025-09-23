import { Router } from 'express';
import {
    getRevenueReport,
    getPaymentTrends,
    getRefundReport,
    getTransactionSummary,
    getTopRevenueSources
} from '../controllers/reportPayment.controller.js';

const router = Router();

// Report routes
router.get('/revenue', getRevenueReport);
router.get('/trends', getPaymentTrends);
router.get('/refunds', getRefundReport);
router.get('/summary', getTransactionSummary);
router.get('/top-sources', getTopRevenueSources);

export default router;