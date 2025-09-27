import { Router } from 'express'
import { generateMembershipsReportHandler, generateMembershipPlansReportHandler, generateMembersReportHandler, generateStaffReportHandler, generateManagersReportHandler, generateInventoryItemsReportHandler, generateStockLevelsReportHandler, generateSuppliersReportHandler, generateRefundsReportHandler, generateInvoicesReportHandler, generatePaymentsReportHandler } from '../controllers/report.controller.js'

const router = Router()

// Report routes
router.get('/memberships/pdf', generateMembershipsReportHandler)
router.get('/membership-plans/pdf', generateMembershipPlansReportHandler)
router.get('/members/pdf', generateMembersReportHandler)
router.get('/staff/pdf', generateStaffReportHandler)
router.get('/managers/pdf', generateManagersReportHandler)
router.get('/refunds/pdf', generateRefundsReportHandler)

// Inventory report routes
router.get('/inventory-items/pdf', generateInventoryItemsReportHandler)
router.get('/stock-levels/pdf', generateStockLevelsReportHandler)
router.get('/suppliers/pdf', generateSuppliersReportHandler)

// Invoice report route
router.get('/invoices/pdf', generateInvoicesReportHandler)

// Payment report route
router.get('/payments/pdf', generatePaymentsReportHandler)

export default router