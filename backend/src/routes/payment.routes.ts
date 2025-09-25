import { Router } from 'express';
import {
    createPayment,
    getPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    processPayment
} from '../controllers/payment.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

// Payment routes
// Process payment (accessible by manager and staff)
router.post('/process/:id', authenticate(["manager","staff"]), processPayment);
//get all payments
router.get('/', authenticate(["manager","staff"]), getPayments);
router.get('/:id', authenticate(["manager","staff"]), getPaymentById);

router.post('/', authenticate(["manager"]), createPayment);
router.put('/:id', authenticate(["manager"]), updatePayment);
router.delete('/:id', authenticate(["manager"]), deletePayment);
export default router;