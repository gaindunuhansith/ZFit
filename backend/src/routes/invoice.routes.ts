import { Router } from 'express';
import {
    createInvoice, getInvoices, getInvoicesById, updateInvoice, deleteInvoice
} from '../controllers/invoice.controller.js';
//middleware

const router = Router();

//router.get('/',  getInvoices);
router.get('/:id', getInvoicesById);
//router.post('/',createInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id',  deleteInvoice);

export default router;