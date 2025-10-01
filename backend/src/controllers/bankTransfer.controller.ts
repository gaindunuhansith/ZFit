import type { Request, Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import BankTransferPayment from '../models/bankTransfer.model.js';
import { uploadReceiptImage } from '../services/fileUpload.service.js';
import { sendBankTransferApprovalEmail, sendBankTransferDeclineEmail } from '../util/sendMail.util.js';

// Extend Request interface for multer
declare global {
  namespace Express {
    interface Request {
      file?: any;
    }
  }
}

// Zod validation schemas
const createBankTransferSchema = z.object({
    membershipId: z.string().min(1, 'Membership ID is required'),
    amount: z.number().min(0, 'Amount must be non-negative'),
    currency: z.string().optional(),
    notes: z.string().optional()
});

const bankTransferIdSchema = z.object({
    id: z.string().min(1, 'Bank transfer ID is required')
});

const approveDeclineSchema = z.object({
    adminNotes: z.string().optional()
});

/**
 * Upload receipt image for bank transfer
 * POST /api/v1/payments/bank-transfer/upload
 */
export const uploadReceipt = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // File validation is handled by multer middleware
        const fileUrl = `/uploads/bank-receipts/${file.filename}`;

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                fileUrl,
                filename: file.filename,
                size: file.size,
                mimetype: file.mimetype
            }
        });
    } catch (error) {
        console.error('Error uploading receipt:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload receipt image'
        });
    }
};

/**
 * Create bank transfer payment
 * POST /api/v1/payments/bank-transfer
 */
export const createBankTransferPayment = async (req: Request, res: Response) => {
    try {
        const validated = createBankTransferSchema.parse(req.body);
        // Temporarily use a default userId for testing without authentication
        const userId = (req as any).userId || '507f1f77bcf86cd799439011'; // Default ObjectId for testing

        // Skip authentication check for now
        // if (!userId) {
        //     return res.status(401).json({
        //         success: false,
        //         message: 'Authentication required'
        //     });
        // }

        // Check if user already has a pending bank transfer for this membership
        const existingPayment = await BankTransferPayment.findOne({
            userId,
            membershipId: validated.membershipId,
            status: 'pending'
        });

        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending bank transfer payment for this membership'
            });
        }

        // Create bank transfer payment record
        const bankTransferPayment = new BankTransferPayment({
            userId,
            membershipId: validated.membershipId,
            amount: validated.amount,
            currency: validated.currency || 'LKR',
            receiptImageUrl: req.body.receiptImageUrl, // Should be provided after file upload
            status: 'pending',
            bankDetails: {
                accountNumber: '123456789012', // Should come from config
                bankName: 'Bank of Ceylon',
                accountHolder: 'ZFit Gym Management'
            },
            notes: validated.notes
        });

        await bankTransferPayment.save();

        res.status(201).json({
            success: true,
            message: 'Bank transfer payment submitted successfully',
            data: {
                id: bankTransferPayment._id,
                status: bankTransferPayment.status,
                createdAt: bankTransferPayment.createdAt
            }
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.issues
            });
        }

        console.error('Error creating bank transfer payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create bank transfer payment'
        });
    }
};

/**
 * Get pending bank transfer payments (Admin only)
 * GET /api/v1/admin/payments/bank-transfer/pending
 */
export const getPendingBankTransfers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const payments = await BankTransferPayment.find({ status: 'pending' })
            .populate('userId', 'name email contactNo')
            .populate('membershipId', 'name price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await BankTransferPayment.countDocuments({ status: 'pending' });

        res.status(200).json({
            success: true,
            data: {
                payments,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching pending bank transfers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending bank transfers'
        });
    }
};

/**
 * Approve bank transfer payment (Admin only)
 * PUT /api/v1/admin/payments/bank-transfer/:id/approve
 */
export const approveBankTransfer = async (req: Request, res: Response) => {
    try {
        const { id } = bankTransferIdSchema.parse(req.params);
        const { adminNotes } = approveDeclineSchema.parse(req.body);
        const adminId = req.user?.id;

        const payment = await BankTransferPayment.findById(id);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Bank transfer payment not found'
            });
        }

        if (payment.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Payment is not in pending status'
            });
        }

        // Populate user and membership data for email
        await payment.populate([
            { path: 'userId', select: 'name email contactNo' },
            { path: 'membershipId', select: 'name price' }
        ]);

        // Update payment status
        payment.status = 'approved';
        if (adminNotes) {
            payment.adminNotes = adminNotes;
        }
        payment.processedBy = new mongoose.Types.ObjectId((req as any).userId);
        payment.processedAt = new Date();

        await payment.save();

        // Send approval email notification
        try {
            const userData = payment.userId as any;
            const membershipData = payment.membershipId as any;
            
            if (userData?.email) {
                await sendBankTransferApprovalEmail(userData.email, {
                    userName: userData.name || 'Customer',
                    membershipName: membershipData?.name || 'Membership',
                    amount: payment.amount,
                    currency: payment.currency,
                    transactionId: (payment._id as mongoose.Types.ObjectId).toString(),
                    approvedDate: new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    adminNotes: adminNotes || undefined
                });
                
                console.log(`Approval email sent to ${userData.email} for bank transfer ${payment._id}`);
            }
        } catch (emailError) {
            console.error('Failed to send approval email:', emailError);
            // Don't fail the approval if email fails - log the error instead
        }

        // TODO: Create actual payment record and activate membership
        // This would involve creating a Payment record and updating membership status

        res.status(200).json({
            success: true,
            message: 'Bank transfer payment approved successfully',
            data: payment
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.issues
            });
        }

        console.error('Error approving bank transfer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve bank transfer payment'
        });
    }
};

/**
 * Decline bank transfer payment (Admin only)
 * PUT /api/v1/admin/payments/bank-transfer/:id/decline
 */
export const declineBankTransfer = async (req: Request, res: Response) => {
    try {
        const { id } = bankTransferIdSchema.parse(req.params);
        const { adminNotes } = approveDeclineSchema.parse(req.body);
        const adminId = req.user?.id;

        const payment = await BankTransferPayment.findById(id);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Bank transfer payment not found'
            });
        }

        if (payment.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Payment is not in pending status'
            });
        }

        // Populate user and membership data for email
        await payment.populate([
            { path: 'userId', select: 'name email contactNo' },
            { path: 'membershipId', select: 'name price' }
        ]);

        // Update payment status
        payment.status = 'declined';
        if (adminNotes) {
            payment.adminNotes = adminNotes;
        }
        payment.processedBy = new mongoose.Types.ObjectId((req as any).userId);
        payment.processedAt = new Date();

        await payment.save();

        // Send decline email notification
        try {
            const userData = payment.userId as any;
            const membershipData = payment.membershipId as any;
            
            if (userData?.email) {
                await sendBankTransferDeclineEmail(userData.email, {
                    userName: userData.name || 'Customer',
                    membershipName: membershipData?.name || 'Membership',
                    amount: payment.amount,
                    currency: payment.currency,
                    transactionId: (payment._id as mongoose.Types.ObjectId).toString(),
                    approvedDate: new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    adminNotes: adminNotes || undefined
                });
                
                console.log(`Decline email sent to ${userData.email} for bank transfer ${payment._id}`);
            }
        } catch (emailError) {
            console.error('Failed to send decline email:', emailError);
            // Don't fail the decline if email fails - log the error instead
        }

        res.status(200).json({
            success: true,
            message: 'Bank transfer payment declined',
            data: payment
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.issues
            });
        }

        console.error('Error declining bank transfer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to decline bank transfer payment'
        });
    }
};

/**
 * Get user's bank transfer payments
 * GET /api/v1/payments/bank-transfer/my-payments
 */
export const getUserBankTransfers = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const payments = await BankTransferPayment.find({ userId })
            .populate('membershipId', 'name price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await BankTransferPayment.countDocuments({ userId });

        res.status(200).json({
            success: true,
            data: {
                payments,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        console.error('Error fetching user bank transfers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bank transfer payments'
        });
    }
};