import type { Request, Response, NextFunction } from 'express'
import { generateMembershipsReport, generateMembershipPlansReport, generateMembersReport, generateStaffReport, generateManagersReport } from '../services/report.service.js'

export const generateMembershipsReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pdfBuffer = await generateMembershipsReport()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=memberships-report.pdf')
    res.setHeader('Content-Length', pdfBuffer.length)

    res.send(pdfBuffer)
  } catch (error) {
    next(error)
  }
}

export const generateMembershipPlansReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pdfBuffer = await generateMembershipPlansReport()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=membership-plans-report.pdf')
    res.setHeader('Content-Length', pdfBuffer.length)

    res.send(pdfBuffer)
  } catch (error) {
    next(error)
  }
}

export const generateMembersReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pdfBuffer = await generateMembersReport()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=members-report.pdf')
    res.setHeader('Content-Length', pdfBuffer.length)

    res.send(pdfBuffer)
  } catch (error) {
    next(error)
  }
}

export const generateStaffReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pdfBuffer = await generateStaffReport()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=staff-report.pdf')
    res.setHeader('Content-Length', pdfBuffer.length)

    res.send(pdfBuffer)
  } catch (error) {
    next(error)
  }
}

export const generateManagersReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pdfBuffer = await generateManagersReport()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=managers-report.pdf')
    res.setHeader('Content-Length', pdfBuffer.length)

    res.send(pdfBuffer)
  } catch (error) {
    next(error)
  }
}