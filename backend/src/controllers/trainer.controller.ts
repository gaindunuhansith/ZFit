import { Request, Response, NextFunction } from 'express';
import { TrainerService } from '../services/trainer.service.js';

export class TrainerController {
    // Create a new trainer
    static async createTrainer(req: Request, res: Response, next: NextFunction) {
        try {
            const trainer = await TrainerService.createTrainer(req.body);
            
            res.status(201).json({
                success: true,
                message: 'Trainer created successfully',
                data: trainer
            });
        } catch (error: any) {
            next(error);
        }
    }

    // Get all trainers
    static async getTrainers(req: Request, res: Response, next: NextFunction) {
        try {
            const trainers = await TrainerService.getTrainers();
            
            res.status(200).json({
                success: true,
                message: 'Trainers retrieved successfully',
                data: trainers
            });
        } catch (error: any) {
            next(error);
        }
    }

    // Get trainer by ID
    static async getTrainerById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const trainer = await TrainerService.getTrainerById(id);
            
            res.status(200).json({
                success: true,
                message: 'Trainer retrieved successfully',
                data: trainer
            });
        } catch (error: any) {
            next(error);
        }
    }

    // Update trainer
    static async updateTrainer(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const trainer = await TrainerService.updateTrainer(id, req.body);
            
            res.status(200).json({
                success: true,
                message: 'Trainer updated successfully',
                data: trainer
            });
        } catch (error: any) {
            next(error);
        }
    }

    // Delete trainer
    static async deleteTrainer(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await TrainerService.deleteTrainer(id);
            
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