import { Router } from 'express';
import {
    createPaymentMethod, getPaymentMethods, getPaymentMethodById, updatePaymentMethod, deletePaymentMethod
} from '../controllers/payMethod.controller.js';
import authenticate from '../middleware/auth.middleware.js';
//middleware

const router = Router();

router.get('/', authenticate(["manager","staff"]), getPaymentMethods);
router.get('/:id', authenticate(["manager","staff"]), getPaymentMethodById);
router.post('/', authenticate(["manager"]), createPaymentMethod);
router.put('/:id', authenticate(["manager"]), updatePaymentMethod);
router.delete('/:id', authenticate(["manager"]), deletePaymentMethod);

export default router;