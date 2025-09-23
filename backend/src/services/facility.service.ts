import { Request, Response } from 'express';
import FacilityModel, { FacilityDocument } from '../models/facility.model.js';
import { AppError } from '../util/AppError.js';

export class FacilityService {
    // Create a new facility
    static async createFacility(facilityData: Partial<FacilityDocument>) {
        try {
            const facility = new FacilityModel(facilityData);
            await facility.save();
            return facility;
        } catch (error: any) {
            throw new AppError(error.message, 400);
        }
    }

    // Get all facilities
    static async getFacilities() {
        try {
            const facilities = await FacilityModel.find({ status: 'active' }).sort({ name: 1 });
            return facilities;
        } catch (error: any) {
            throw new AppError(error.message, 500);
        }
    }

    // Get facility by ID
    static async getFacilityById(id: string) {
        try {
            const facility = await FacilityModel.findById(id);
            if (!facility) {
                throw new AppError('Facility not found', 404);
            }
            return facility;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError('Invalid facility ID', 400);
        }
    }

    // Update facility
    static async updateFacility(id: string, updateData: Partial<FacilityDocument>) {
        try {
            const facility = await FacilityModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            
            if (!facility) {
                throw new AppError('Facility not found', 404);
            }
            
            return facility;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message, 400);
        }
    }

    // Delete facility
    static async deleteFacility(id: string) {
        try {
            const facility = await FacilityModel.findByIdAndDelete(id);
            if (!facility) {
                throw new AppError('Facility not found', 404);
            }
            return { message: 'Facility deleted successfully' };
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError('Invalid facility ID', 400);
        }
    }
}