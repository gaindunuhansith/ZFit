import type { Request, Response } from 'express';
import FacilityModel, { type FacilityDocument } from '../models/Facility.model.js';
import AppAssert from '../util/AppAssert.js';

export class FacilityService {
    // Create a new facility
    static async createFacility(facilityData: Partial<FacilityDocument>) {
        try {
            const facility = new FacilityModel(facilityData);
            await facility.save();
            return facility;
        } catch (error: any) {
            AppAssert(false, 400, error.message); 
        }
    }

    // Get all facilities
    static async getFacilities() {
        try {
            const facilities = await FacilityModel.find({ status: 'active' }).sort({ name: 1 });
            return facilities;
        } catch (error: any) {
            AppAssert(false, 500, error.message);
        }
    }

    // Get facility by ID
    static async getFacilityById(id: string) {
        try {
            const facility = await FacilityModel.findById(id);
            AppAssert(facility, 404, 'Facility not found');
            return facility;
        } catch (error: any) {
            AppAssert(false, 400, 'Invalid facility ID');
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

            AppAssert(facility, 404, 'Facility not found');
            return facility;
        } catch (error: any) {
            AppAssert(false, 400, error.message);
        }
    }

    // Delete facility
    static async deleteFacility(id: string) {
        try {
            const facility = await FacilityModel.findByIdAndDelete(id);
            AppAssert(facility, 404, 'Facility not found');
            return { message: 'Facility deleted successfully' };
        } catch (error: any) {
            AppAssert(false, 400, 'Invalid facility ID');
        }
    }
}
