import express from "express";
import { FacilityController } from "../controllers/facility.controller.js";


const router = express.Router();

// Create a new facility
router.post("/", FacilityController.createFacility);

// Get all facilities
router.get("/", FacilityController.getFacilities);

// Get a facility by ID
router.get("/:id", FacilityController.getFacilityById);

// Update a facility
router.put("/:id", FacilityController.updateFacility);

// Delete a facility
router.delete("/:id", FacilityController.deleteFacility);

export default router;
