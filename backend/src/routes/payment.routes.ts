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

// Import sub-route files
import invoiceRoutes from './invoice.routes.js';
import refundRoutes from './refund.routes.js';
import gatewayRoutes from './gateway.routes.js';

const router = Router();

// Main payment routes
// Process payment 
router.post('/process/:id', authenticate(["manager","staff"]), processPayment);
//get all payments
router.get('/', authenticate(["manager","staff"]), getPayments);
router.get('/:id', authenticate(["manager","staff"]), getPaymentById);

router.post('/', authenticate(["manager"]), createPayment);
router.put('/:id', authenticate(["manager"]), updatePayment);
router.delete('/:id', authenticate(["manager"]), deletePayment);

// Sub-routes for payment-related functionality
router.use('/invoices', invoiceRoutes);
router.use('/refunds', refundRoutes);
router.use('/gateways', gatewayRoutes);

export default router;