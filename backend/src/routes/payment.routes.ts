import { Router } from 'express';
import {
    createPayment,
    getPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    processPayment
} from '../controllers/payment.controller.js';

const router = Router();

// Payment routes
router.post('/process/:id', processPayment);
router.get('/', getPayments);
router.get('/:id', getPaymentById);
router.post('/', createPayment);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);export default router;