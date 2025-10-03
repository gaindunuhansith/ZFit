import { Router } from 'express';
import type { Request, Response } from 'express';
import {
    createInvoice, getInvoices, getInvoiceById, updateInvoice, deleteInvoice
} from '../controllers/invoice.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import { invoiceScheduler } from '../util/invoiceScheduler.util.js';

const router = Router();

// Invoice routes with authentication
router.get('/',  getInvoices);
router.get('/:id',  getInvoiceById);
router.post('/', createInvoice);
router.put('/:id',  updateInvoice);
router.delete('/:id', deleteInvoice);

// Admin-only scheduler endpoints for testing
router.post('/scheduler/check-overdue', authenticate, async (req: Request, res: Response) => {
    try {
        await invoiceScheduler.triggerOverdueCheck();
        res.json({ success: true, message: 'Overdue check completed' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to check overdue invoices' });
    }
});

export default router;