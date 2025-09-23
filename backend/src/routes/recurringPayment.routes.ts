import { Router } from 'express';
import {
    createRecurringPayment,
    getRecurringPayments,
    getRecurringPaymentById,
    updateRecurringPayment,
    deleteRecurringPayment,
    pauseRecurringPayment,
    resumeRecurringPayment,
    processRecurringPayment,
    getDueRecurringPayments,
    getRecurringPaymentsByRelated
} from '../controllers/recurringPayment.controller.js';

const router = Router();

// Recurring payment routes
router.post('/', createRecurringPayment);
router.get('/', getRecurringPayments);
router.get('/due', getDueRecurringPayments); // Admin/staff only
router.get('/:id', getRecurringPaymentById);
router.put('/:id', updateRecurringPayment);
router.delete('/:id', deleteRecurringPayment); // Cancel
router.post('/:id/pause', pauseRecurringPayment);
router.post('/:id/resume', resumeRecurringPayment);
router.post('/:id/process', processRecurringPayment); // Admin/staff only
router.get('/related/:relatedId/:relatedType', getRecurringPaymentsByRelated); // Admin/staff only

export default router;