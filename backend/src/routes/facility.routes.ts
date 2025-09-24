

import express from 'express';
import { FacilityController } from '../controllers/facility.controller.js';
import {
  validateBody,
  createFacilitySchema,
  updateFacilitySchema,
  validateIdParam,
} from "../validations/Zod-validation.js";


const router = express.Router();

// Create a new facility
router.post('/', FacilityController.createFacility);

// Get all facilities
router.get('/', FacilityController.getFacilities);

// Get facility by ID
router.get('/:id', FacilityController.getFacilityById);

// Update facility
router.put('/:id', FacilityController.updateFacility);

// Delete facility
router.delete('/:id', FacilityController.deleteFacility);

export default router;