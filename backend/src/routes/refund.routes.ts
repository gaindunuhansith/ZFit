import { Router } from 'express';
import {
    createRefund, getRefunds, getRefundById, updateRefund, deleteRefund
} from '../controllers/refund.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate(["manager","staff"]), getRefunds);
router.get('/:id', authenticate(["manager","staff"]), getRefundById);
router.post('/', authenticate(["manager","staff"]), createRefund);
router.put('/:id', authenticate(["manager","staff"]), updateRefund);
router.delete('/:id', authenticate(["manager","staff"]), deleteRefund);

export default router;