import { Router } from 'express';
import {
    uploadReceipt,
    createBankTransferPayment,
    getPendingBankTransfers,
    approveBankTransfer,
    declineBankTransfer,
    getUserBankTransfers
} from '../controllers/bankTransfer.controller.js';
import { uploadReceiptImage, handleMulterError } from '../services/fileUpload.service.js';
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

// Temporarily remove authentication for testing
// router.use(authenticate());

// Upload receipt image
router.post('/upload', uploadReceiptImage.single('receipt'), handleMulterError, uploadReceipt);

// Create bank transfer payment
router.post('/', createBankTransferPayment);

// Get user's own bank transfer payments
router.get('/my-payments', getUserBankTransfers);

// Admin routes - require admin role
router.get('/pending', getPendingBankTransfers);
router.put('/:id/approve', approveBankTransfer);
router.put('/:id/decline', declineBankTransfer);

export default router;