import { Router } from 'express';
import {
    createRecurringPayment,
    getRecurringPayments,
    getRecurringPaymentById,
    updateRecurringPayment,
    deleteRecurringPayment,
    pauseRecurringPayment,
    resumeRecurringPayment,
    cancelRecurringPayment,
    getDueRecurringPayments,
    updatePaymentStats
} from '../controllers/recurringPay.controller.js';

const router = Router();

// Recurring payment routes
router.get('/', getRecurringPayments);                    // GET /api/v1/recurring-payments
router.get('/:id', getRecurringPaymentById);             // GET /api/v1/recurring-payments/{id}
router.post('/', createRecurringPayment);                 // POST /api/v1/recurring-payments
router.put('/:id', updateRecurringPayment);               // PUT /api/v1/recurring-payments/{id}
router.delete('/:id', deleteRecurringPayment);            // DELETE /api/v1/recurring-payments/{id}

// Status management routes
router.patch('/:id/pause', pauseRecurringPayment);        // PATCH /api/v1/recurring-payments/{id}/pause
router.patch('/:id/resume', resumeRecurringPayment);      // PATCH /api/v1/recurring-payments/{id}/resume
router.patch('/:id/cancel', cancelRecurringPayment);      // PATCH /api/v1/recurring-payments/{id}/cancel

// Admin routes
router.get('/admin/due', getDueRecurringPayments);        // GET /api/v1/recurring-payments/admin/due

// Internal routes (for payment processing)
router.patch('/:id/stats', updatePaymentStats);           // PATCH /api/v1/recurring-payments/{id}/stats

export default router;