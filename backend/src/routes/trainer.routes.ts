import express from 'express';
import { TrainerController } from '../controllers/trainer.controller.js';

const router = express.Router();

// Create a new trainer
router.post('/', TrainerController.createTrainer);

// Get all trainers
router.get('/', TrainerController.getTrainers);

// Get trainer by ID
router.get('/:id', TrainerController.getTrainerById);

// Update trainer
router.put('/:id', TrainerController.updateTrainer);

// Delete trainer
router.delete('/:id', TrainerController.deleteTrainer);

export default router;