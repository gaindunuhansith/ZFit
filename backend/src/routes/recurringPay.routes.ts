import { Router } from 'express';
import {
    createRecurringPayment, 
    getRecurringPayments, 
    getRecurringPaymentById,
     updateRecurringPayment, 
     deleteRecurringPayment, 
     pauseRecurringPayment,
      resumeRecurringPayment
} from '../controllers/recurringPay.controller.js';
//middleware

const router = Router();


//router.get('/',  getRecurringPayments);
router.get('/:id', getRecurringPaymentById);
//router.post('/',createRecurringPayment);
router.put('/:id', updateRecurringPayment);
router.delete('/:id', deleteRecurringPayment);
router.post('/:id/pause',  pauseRecurringPayment);
router.post('/:id/resume',  resumeRecurringPayment);

export default router;