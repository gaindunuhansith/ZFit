import express from 'express';
import { ClassController } from '../controllers/class.controller.js';

const router = express.Router();

// Create a new class
router.post('/', ClassController.createClass);

// Get all classes
router.get('/', ClassController.getClasses);

// Get class by ID
router.get('/:id', ClassController.getClassById);

// Update class by ID
router.patch('/:id', ClassController.updateClass);

// Delete class by ID
router.delete('/:id', ClassController.deleteClass);

export default router;
