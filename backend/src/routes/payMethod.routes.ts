import { Router } from 'express';
import {
    createPaymentMethod, getPaymentMethods, getPaymentMethodById, updatePaymentMethod, deletePaymentMethod
} from '../controllers/payMethod.controller.js';
//middleware

const router = Router();

//router.get('/',  getPaymentMethods);
router.get('/:id',getPaymentMethodById);
//router.post('/',  createPaymentMethod);
router.put('/:id', updatePaymentMethod);
router.delete('/:id',deletePaymentMethod);

export default router;