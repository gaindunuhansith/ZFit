import type { Request, Response, NextFunction } from 'express';
import { FacilityService } from '../services/facility.service.js';

export class FacilityController {
    // Create a new facility
    static async createFacility(req: Request, res: Response, next: NextFunction) {
        try {
            const facility = await FacilityService.createFacility(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Facility created successfully',
                data: facility
            });
        } catch (error: any) {
            next(error);
        }
    }

    // Get all facilities
    static async getFacilities(req: Request, res: Response, next: NextFunction) {
        try {
            const facilities = await FacilityService.getFacilities();
            
            res.status(200).json({
                success: true,
                message: 'Facilities retrieved successfully',
                data: facilities
            });
        } catch (error: any) {
            next(error);
        }
    }

    // Get facility by ID
    static async getFacilityById(req: Request, res: Response, next: NextFunction) {
        try {
            const  id  = req.params?.id as string;
            const facility = await FacilityService.getFacilityById(id);
            
            res.status(200).json({
                success: true,
                message: 'Facility retrieved successfully',
                data: facility
            });
        } catch (error: any) {
            next(error);
        }
    }

    // Update facility
    static async updateFacility(req: Request, res: Response, next: NextFunction) {
        try {
            const id  = req.params?.id as string;
            const facility = await FacilityService.updateFacility(id, req.body);
            
            res.status(200).json({
                success: true,
                message: 'Facility updated successfully',
                data: facility
            });
        } catch (error: any) {
            next(error);
        }
    }

    // Delete facility
    static async deleteFacility(req: Request, res: Response, next: NextFunction) {
        try {
            const  id  = req.params?.id as string;
            const result = await FacilityService.deleteFacility(id);
            
            res.status(200).json({
                success: true,
                message: result.message,
                data: null
            });
        } catch (error: any) {
            next(error);
        }
    }
}