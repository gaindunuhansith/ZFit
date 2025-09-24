import type { Request, Response, NextFunction } from 'express';
import { ClassService } from '../services/class.service.js';
import {createClassSchema } from '../validations/Zod-validation.js';

export class ClassController {
    // Create a new class
    static async createClass(req: Request, res: Response, next: NextFunction) {
        try {
            const classInstance = await ClassService.createClass(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Class created successfully',
                data: classInstance
            });
        } catch (error: any) {
            next(error);
        }
    }

    // Get all classes
    static async getClasses(req: Request, res: Response, next: NextFunction) {
        try {
            const classes = await ClassService.getClasses();
            
            res.status(200).json({
                success: true,
                message: 'Classes retrieved successfully',
                data: classes
            });
        } catch (error: any) {
            next(error);
        }
    }

    // Get class by ID
    static async getClassById(req: Request, res: Response, next: NextFunction) {
        try {
            const id  = req.params?.id as string;
            const classInstance = await ClassService.getClassById(id);
            
            res.status(200).json({
                success: true,
                message: 'Class retrieved successfully',
                data: classInstance
            });
        } catch (error: any) {
            next(error);
        }
    }

    // Update class
    static async updateClass(req: Request, res: Response, next: NextFunction) {
        try {
            const id  = req.params?.id as string;
            const classInstance = await ClassService.updateClass(id, req.body);
            
            res.status(200).json({
                success: true,
                message: 'Class updated successfully',
                data: classInstance
            });
        } catch (error: any) {
            next(error);
        }
    }

    // Delete class
    static async deleteClass(req: Request, res: Response, next: NextFunction) {
        try {
            const id  = req.params?.id as string;
            const result = await ClassService.deleteClass(id);
            
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