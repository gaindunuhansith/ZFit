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
router.post('/payment/process/:id', authenticate(["manager","staff"]), processPayment);
//get all payments
router.get('/payment/', authenticate(["manager","staff"]), getPayments);
router.get('/payment/:id', authenticate(["manager","staff"]), getPaymentById);

router.post('/payment/', authenticate(["manager"]), createPayment);
router.put('/payment/:id', authenticate(["manager"]), updatePayment);
router.delete('/payment/:id', authenticate(["manager"]), deletePayment);
export default router;