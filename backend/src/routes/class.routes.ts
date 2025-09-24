import express from 'express';
import { ClassController } from '../controllers/class.controller.js';
import { validateBody, createClassSchema, updateClassSchema, validateIdParam } from '../validations/Zod-validation.js';

const router = express.Router();

// Create a new class
router.post('/', ClassController.createClass);

// Get all classes
router.get('/', ClassController.getClasses);

// Get class by ID
router.get('/:id', ClassController.getClassById);

// Update class
router.put('/:id', ClassController.updateClass);

// Delete class
router.delete('/:id', ClassController.deleteClass);

export default router;