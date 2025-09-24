import { Router } from 'express';
import {
    processPayHerePayment,
    handlePayHereWebhook,
    getPaymentStatus,
    processPayHereRefund,
    testPayHereConfig
} from '../controllers/payhere.controller.js';

const router = Router();

// PayHere payment processing
router.post('/payhere/process', processPayHerePayment);

// PayHere webhook handler (no auth required - PayHere will call this)
router.post('/webhook/payhere', handlePayHereWebhook);

// Get payment status by transaction ID
router.get('/status/:transactionId', getPaymentStatus);

// PayHere refund processing (future enhancement)
router.post('/payhere/refund', processPayHereRefund);

// Test PayHere configuration
router.get('/payhere/test', testPayHereConfig);

export default router;