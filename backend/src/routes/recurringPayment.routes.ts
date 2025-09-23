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
router.get('/due', getDueRecurringPayments);
router.get('/:id', getRecurringPaymentById);
router.put('/:id', updateRecurringPayment);
router.delete('/:id', deleteRecurringPayment);
router.post('/:id/pause', pauseRecurringPayment);
router.post('/:id/resume', resumeRecurringPayment);
router.post('/:id/process', processRecurringPayment);
router.get('/related/:relatedId/:relatedType', getRecurringPaymentsByRelated);

export default router;