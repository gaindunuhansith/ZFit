import { Router } from 'express';
import {
    createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice
} from '../controllers/invoice.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

// Invoice routes with authentication
router.get('/', authenticate(["manager","staff"]), getInvoices);
router.get('/:id', authenticate(["manager","staff"]), getInvoiceById);
router.post('/', authenticate(["manager"]), createInvoice);
router.put('/:id', authenticate(["manager"]), updateInvoice);
router.delete('/:id', authenticate(["manager"]), deleteInvoice);

export default router;