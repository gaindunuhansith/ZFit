import type { Request, Response } from 'express';
import { TrainerService } from '../services/Trainer.service.js';

export class TrainerController {
    static async createTrainer(req: Request, res: Response) {
        try {
            const trainer = await TrainerService.createTrainer(req.body);
            res.status(201).json({ message: 'Trainer created successfully', trainer });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    static async getAllTrainers(_req: Request, res: Response) {
        try {
            const trainers = await TrainerService.getAllTrainers();
            res.json(trainers);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    static async getTrainerById(req: Request, res: Response) {
        try {
            const id  = req.params?.id as string;
            const trainer = await TrainerService.getTrainerById(id);
            res.json(trainer);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    static async updateTrainer(req: Request, res: Response) {
        try {
            const  id  = req.params?.id as string;
            const trainer = await TrainerService.updateTrainer(id, req.body);
            res.json({ message: 'Trainer updated successfully', trainer });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    static async deleteTrainer(req: Request, res: Response) {
        try {
            const id  = req.params?.id as string;
            await TrainerService.deleteTrainer(id);
            res.json({ message: 'Trainer deleted successfully' });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    }
}
