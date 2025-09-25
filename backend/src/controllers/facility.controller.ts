import type { Request, Response, NextFunction } from "express";
import * as FacilityService from "../services/facility.service.js";
import { z } from "zod";
import mongoose from "mongoose";
import type { IFacility } from "../models/facility.model.js";

// Zod schema for validation
const facilitySchema = z.object({
  name: z.string().min(1),
  capacity: z.number().min(1),
  status: z.enum(["active", "inactive"]).optional(),
  equipments: z.array(z.string()).optional(), // array of ObjectId strings
});

// CREATE FACILITY
export const createFacility = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = facilitySchema.parse(req.body);
    // Convert equipment IDs to ObjectId
    if (data.equipments) data.equipments = data.equipments.map(id => new mongoose.Types.ObjectId(id));
    const facility = await FacilityService.createFacility(data);
    res.status(201).json({ success: true, data: facility });
  } catch (err: any) {
    next(err);
  }
};

// GET ALL FACILITIES
export const getAllFacilities = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const facilities = await FacilityService.getAllFacilities();
    res.status(200).json({ success: true, data: facilities });
  } catch (err: any) {
    next(err);
  }
};

// GET FACILITY BY ID
export const getFacilityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid Facility ID" });

    const facility = await FacilityService.getFacilityById(id);
    if (!facility) return res.status(404).json({ success: false, message: "Facility not found" });

    res.status(200).json({ success: true, data: facility });
  } catch (err: any) {
    next(err);
  }
};

// UPDATE FACILITY
export const updateFacility = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid Facility ID" });

    const data = facilitySchema.partial().parse(req.body);
    if (data.equipments) data.equipments = data.equipments.map(id => new mongoose.Types.ObjectId(id));

    const updatedFacility = await FacilityService.updateFacility(id, data);
    if (!updatedFacility) return res.status(404).json({ success: false, message: "Facility not found" });

    res.status(200).json({ success: true, data: updatedFacility });
  } catch (err: any) {
    next(err);
  }
};

// DELETE FACILITY
export const deleteFacility = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid Facility ID" });

    const deletedFacility = await FacilityService.deleteFacility(id);
    if (!deletedFacility) return res.status(404).json({ success: false, message: "Facility not found" });

    res.status(200).json({ success: true, data: deletedFacility });
  } catch (err: any) {
    next(err);
  }
};
