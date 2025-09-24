import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import * as ClassService from '../services/class.service.js';
import type { IClass } from '../models/class.model.js';

interface ClassParams { id: string }

export class ClassController {

  // CREATE CLASS
  static async createClass(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        name: z.string().min(1, "Class name is required"),
        type: z.string().min(1, "Class type is required"),
        duration: z.number().min(1, "Duration must be at least 1 minute"),
        maxCapacity: z.number().min(1, "Capacity must be at least 1"),
        status: z.enum(['active','inactive']).optional()
      });

      const validatedData = schema.parse(req.body) as Omit<IClass, 'createdAt' | 'updatedAt'>;
      const classInstance = await ClassService.createClass(validatedData);
      res.status(201).json({ success: true, data: classInstance });

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ success: false, errors: err.flatten() });
      }
      next(err);
    }
  }

  // GET ALL CLASSES
  static async getClasses(req: Request, res: Response, next: NextFunction) {
    try {
      const classes = await ClassService.getClasses();
      res.status(200).json({ success: true, data: classes });
    } catch (err) {
      next(err);
    }
  }

  // GET CLASS BY ID
  static async getClassById(req: Request<ClassParams>, res: Response, next: NextFunction) {
    try {
      const classInstance = await ClassService.getClassById(req.params.id);

      if (!classInstance) {
        return res.status(404).json({ success: false, message: 'Class not found' });
      }

      res.status(200).json({ success: true, data: classInstance });
    } catch (err) {
      next(err);
    }
  }

  // UPDATE CLASS
  static async updateClass(req: Request<ClassParams>, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        name: z.string().min(1).optional(),
        type: z.string().min(1).optional(),
        duration: z.number().min(1).optional(),
        maxCapacity: z.number().min(1).optional(),
        status: z.enum(['active','inactive']).optional()
      });

      const validatedData = schema.parse(req.body) as Partial<IClass>;
      const updatedClass = await ClassService.updateClass(req.params.id, validatedData);

      if (!updatedClass) {
        return res.status(404).json({ success: false, message: 'Class not found' });
      }

      res.status(200).json({ success: true, data: updatedClass });

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ success: false, errors: err.flatten() });
      }
      next(err);
    }
  }

  // DELETE CLASS
  static async deleteClass(req: Request<ClassParams>, res: Response, next: NextFunction) {
    try {
      const deletedClass = await ClassService.deleteClass(req.params.id);

      if (!deletedClass) {
        return res.status(404).json({ success: false, message: 'Class not found' });
      }

      res.status(200).json({ success: true, message: 'Class deleted successfully', data: deletedClass });
    } catch (err) {
      next(err);
    }
  }
}
