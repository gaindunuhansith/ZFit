import { Router } from 'express';
import {
    createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice
} from '../controllers/invoice.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

// Invoice routes with authentication
router.get('/',  getInvoices);
router.get('/:id',  getInvoiceById);
router.post('/', createInvoice);
router.put('/:id',  updateInvoice);
router.delete('/:id', deleteInvoice);

export default router;