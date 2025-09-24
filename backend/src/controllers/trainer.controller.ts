import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import * as TrainerService from '../services/Trainer.service.js';
import { type ITrainer } from '../models/Trainer.model.js';

interface TrainerParams { id: string }

export class TrainerController {

  // CREATE TRAINER
  static async createTrainer(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        name: z.string().min(1, "Name is required"),
        specialty: z.string().min(1, "Specialty is required"),
        experience: z.number().min(0, "Experience must be 0 or more"),
        status: z.enum(['active','inactive']).optional()
      });

      const validatedData = schema.parse(req.body) as Omit<ITrainer,'createdAt'|'updatedAt'>;
      const trainer = await TrainerService.createTrainer(validatedData);

      res.status(201).json({ success: true, data: trainer });

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ success: false, errors: err.flatten() });
      }
      next(err);
    }
  }

  // GET ALL TRAINERS
  static async getTrainers(req: Request, res: Response, next: NextFunction) {
    try {
      const trainers = await TrainerService.getTrainers();
      res.status(200).json({ success: true, data: trainers });
    } catch (err) {
      next(err);
    }
  }

  // GET TRAINER BY ID
  static async getTrainerById(req: Request<TrainerParams>, res: Response, next: NextFunction) {
    try {
      const trainer = await TrainerService.getTrainerById(req.params.id);
      if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

      res.status(200).json({ success: true, data: trainer });
    } catch (err) {
      next(err);
    }
  }

  // UPDATE TRAINER
  static async updateTrainer(req: Request<TrainerParams>, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        name: z.string().min(1).optional(),
        specialty: z.string().min(1).optional(),
        experience: z.number().min(0).optional(),
        status: z.enum(['active','inactive']).optional()
      });

      const validatedData = schema.parse(req.body) as Partial<ITrainer>;
      const updatedTrainer = await TrainerService.updateTrainer(req.params.id, validatedData);

      if (!updatedTrainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

      res.status(200).json({ success: true, data: updatedTrainer });
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ success: false, errors: err.flatten() });
      next(err);
    }
  }

  // DELETE TRAINER
  static async deleteTrainer(req: Request<TrainerParams>, res: Response, next: NextFunction) {
    try {
      const deletedTrainer = await TrainerService.deleteTrainer(req.params.id);
      if (!deletedTrainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

      res.status(200).json({ success: true, message: 'Trainer deleted successfully', data: deletedTrainer });
    } catch (err) {
      next(err);
    }
  }
}
