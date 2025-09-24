import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import * as FacilityService from "../services/facility.service.js";
import type { IFacility } from "../models/facility.model.js";

interface FacilityParams { id: string }

export class FacilityController {

  // CREATE FACILITY
  static async createFacility(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        name: z.string().min(1, "Facility name is required"),
        capacity: z.number().min(1, "Capacity must be at least 1"),
        status: z.enum(["active", "inactive"]).optional(),
        equipments: z.array(z.string()).optional()
      });

      const validated = schema.parse(req.body)as Omit<IFacility, 'createdAt'|'updatedAt'>   ;
      const facility = await FacilityService.createFacility(validated);
      res.status(201).json({ success: true, data: facility });

    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ success: false, errors: err.flatten() });
      next(err);
    }
  }

  // GET ALL FACILITIES
  static async getFacilities(req: Request, res: Response, next: NextFunction) {
    try {
      const facilities = await FacilityService.getFacilities();
      res.status(200).json({ success: true, data: facilities });
    } catch (err) {
      next(err);
    }
  }

  // GET FACILITY BY ID
  static async getFacilityById(req: Request<FacilityParams>, res: Response, next: NextFunction) {
    try {
      const facility = await FacilityService.getFacilityById(req.params.id);
      if (!facility) return res.status(404).json({ success: false, message: "Facility not found" });
      res.status(200).json({ success: true, data: facility });
    } catch (err) {
      next(err);
    }
  }

  // UPDATE FACILITY
  static async updateFacility(req: Request<FacilityParams>, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        name: z.string().min(1).optional(),
        capacity: z.number().min(1).optional(),
        status: z.enum(["active", "inactive"]).optional(),
        equipments: z.array(z.string()).optional()
      });

      const validated = schema.parse(req.body)as Partial<IFacility>;
      const updated = await FacilityService.updateFacility(req.params.id, validated);
      if (!updated) return res.status(404).json({ success: false, message: "Facility not found" });
      res.status(200).json({ success: true, data: updated });

    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ success: false, errors: err.flatten() });
      next(err);
    }
  }

  // DELETE FACILITY
  static async deleteFacility(req: Request<FacilityParams>, res: Response, next: NextFunction) {
    try {
      const deleted = await FacilityService.deleteFacility(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: "Facility not found" });
      res.status(200).json({ success: true, message: "Facility deleted successfully", data: deleted });
    } catch (err) {
      next(err);
    }
  }
}
