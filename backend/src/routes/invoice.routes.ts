import { Router } from 'express';
import {
    createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice
} from '../controllers/invoice.controller.js';

const router = Router();

// Uncommented routes
router.get('/', getInvoices);
router.get('/:id', getInvoiceById);
router.post('/', createInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

export default router;