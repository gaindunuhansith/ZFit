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

// All Routes need auth middleware
router.post('/process', processPayment); // PayHere processing
//router.get('/', getPayments);     // Get all payments
router.get('/:id', getPaymentById); // Get payment by ID
router.post('/', createPayment); // Create payment
router.put('/:id', updatePayment); // Update payment
router.delete('/:id', deletePayment); // Delete payment

export default router;