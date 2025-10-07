import type { Request, Response, NextFunction } from 'express'
import { generateMembershipsReport, generateMembershipPlansReport, generateMembersReport, generateStaffReport, generateManagersReport, type InventoryReportFilters } from '../services/report.service.js'

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

export const generateInventoryItemsReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { generateInventoryItemsReport } = await import('../services/report.service.js')
    
    // Extract filter parameters from query string (GET) or request body (POST)
    const isPostRequest = req.method === 'POST'
    const source = isPostRequest ? req.body : req.query
    
    const filters: InventoryReportFilters = {
      searchTerm: source.searchTerm || undefined,
      categoryId: source.categoryId || undefined,
      type: source.type || undefined,
      lowStockOnly: source.lowStockOnly === 'true' || source.lowStockOnly === true || undefined,
      supplierId: source.supplierId || undefined,
      minStock: source.minStock ? parseInt(source.minStock as string) : undefined,
      maxStock: source.maxStock ? parseInt(source.maxStock as string) : undefined
    }

    const pdfBuffer = await generateInventoryItemsReport(filters)

    // Generate filename with timestamp and filter indication
    const timestamp = new Date().toISOString().split('T')[0]
    const hasFilters = Object.values(filters).some(v => v !== undefined && v !== '')
    const filename = `inventory-items-report${hasFilters ? '-filtered' : ''}-${timestamp}.pdf`

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
    res.setHeader('Content-Length', pdfBuffer.length)

    res.send(pdfBuffer)
  } catch (error) {
    next(error)
  }
}

export const generateStockLevelsReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { generateStockLevelsReport } = await import('../services/report.service.js')
    
    // Extract filter parameters from query string (GET) or request body (POST)
    const isPostRequest = req.method === 'POST'
    const source = isPostRequest ? req.body : req.query
    
    const filters: InventoryReportFilters = {
      searchTerm: source.searchTerm || undefined,
      categoryId: source.categoryId || undefined,
      lowStockOnly: source.lowStockOnly === 'true' || source.lowStockOnly === true || undefined,
      supplierId: source.supplierId || undefined,
      minStock: source.minStock ? parseInt(source.minStock as string) : undefined,
      maxStock: source.maxStock ? parseInt(source.maxStock as string) : undefined
    }

    const pdfBuffer = await generateStockLevelsReport(filters)

    // Generate filename with timestamp and filter indication
    const timestamp = new Date().toISOString().split('T')[0]
    const hasFilters = Object.values(filters).some(v => v !== undefined && v !== '')
    const filename = `stock-levels-report${hasFilters ? '-filtered' : ''}-${timestamp}.pdf`

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
    res.setHeader('Content-Length', pdfBuffer.length)

    res.send(pdfBuffer)
  } catch (error) {
    next(error)
  }
}

export const generateSuppliersReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { generateSuppliersReport } = await import('../services/report.service.js')
    
    // Extract filter parameters from query string
    const filters = {
      searchTerm: req.query.searchTerm as string
    }

    const pdfBuffer = await generateSuppliersReport(filters.searchTerm)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=suppliers-report.pdf')
    res.setHeader('Content-Length', pdfBuffer.length)

    res.send(pdfBuffer)
  } catch (error) {
    next(error)
  }
}

export const generateCategoriesReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { generateCategoriesReport } = await import('../services/report.service.js')
    
    // Extract filter parameters from query string
    const filters = {
      searchTerm: req.query.searchTerm as string,
      activeOnly: req.query.activeOnly === 'true'
    }

    const pdfBuffer = await generateCategoriesReport(filters)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=categories-report.pdf')
    res.setHeader('Content-Length', pdfBuffer.length)

    res.send(pdfBuffer)
  } catch (error) {
    next(error)
  }
}

export const generateInvoicesReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { generateInvoicesReport } = await import('../services/report.service.js')
    const pdfBuffer = await generateInvoicesReport()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=invoices-report.pdf')
    res.setHeader('Content-Length', pdfBuffer.length)

    res.send(pdfBuffer)
  } catch (error) {
    next(error)
  }
}

export const generatePaymentsReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { generatePaymentsReport } = await import('../services/report.service.js')
    const pdfBuffer = await generatePaymentsReport()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=payments-report.pdf')
    res.setHeader('Content-Length', pdfBuffer.length)

    res.send(pdfBuffer)
  } catch (error) {
    next(error)
  }
}

export const generateRefundsReportHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { generateRefundsReport } = await import('../services/report.service.js')
    const pdfBuffer = await generateRefundsReport()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=refunds-report.pdf')
    res.setHeader('Content-Length', pdfBuffer.length)

    res.send(pdfBuffer)
  } catch (error) {
    next(error)
  }
}