import { Router } from 'express';
import {
    createPayment,
    getPayments,
    getPaymentById,
    updatePayment,
    deletePayment,
    processPayment
} from '../controllers/payment.controller.js';  
//middelware

const router = Router();

// All routes require auth
/*
router.post('/process', authMiddleware, processPayment); 
router.get('/', authMiddleware, getPayments);  
router.get('/:id', authMiddleware, getPaymentById);
router.post('/', authMiddleware, createPayment);
router.put('/:id', authMiddleware, updatePayment);
router.delete('/:id', authMiddleware, deletePayment);
*/

export default router;