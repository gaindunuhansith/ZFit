import express from 'express';
import { FacilityController } from '../controllers/facility.controller.js';

const router = express.Router();

router.post('/', FacilityController.createFacility);
router.get('/', FacilityController.getFacilities);
router.get('/:id', FacilityController.getFacilityById);
router.patch('/:id', FacilityController.updateFacility);
router.delete('/:id', FacilityController.deleteFacility);
export default router;

