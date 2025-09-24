import { Router } from 'express';
import { TrainerController } from '../controllers/Trainer.controller.js';
import { validateBody, createTrainerSchema, updateTrainerSchema, validateIdParam } from  '../validations/Zod-validation.js';

const router = Router();

// CRUD routes
router.post('/', TrainerController.createTrainer);
router.get('/', TrainerController.getAllTrainers);
router.get('/:id', TrainerController.getTrainerById);
router.put('/:id', TrainerController.updateTrainer);
router.delete('/:id', TrainerController.deleteTrainer);

export default router;
