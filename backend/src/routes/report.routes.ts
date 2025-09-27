import { Router } from 'express'
import { generateMembershipsReportHandler, generateMembershipPlansReportHandler, generateMembersReportHandler, generateStaffReportHandler, generateManagersReportHandler } from '../controllers/report.controller.js'

const router = Router()

// Report routes
router.get('/memberships/pdf', generateMembershipsReportHandler)
router.get('/membership-plans/pdf', generateMembershipPlansReportHandler)
router.get('/members/pdf', generateMembersReportHandler)
router.get('/staff/pdf', generateStaffReportHandler)
router.get('/managers/pdf', generateManagersReportHandler)

export default router