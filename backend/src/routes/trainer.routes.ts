import express from 'express';
import { TrainerController } from '../controllers/Trainer.controller.js';

const router = express.Router();

router.post('/', TrainerController.createTrainer);
router.get('/', TrainerController.getTrainers);
router.get('/:id', TrainerController.getTrainerById);
router.patch('/:id', TrainerController.updateTrainer);
router.delete('/:id', TrainerController.deleteTrainer);

export default router;
