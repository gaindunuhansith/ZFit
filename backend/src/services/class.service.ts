import type { Request, Response } from 'express';
import ClassModel, { type ClassDocument } from '../models/class.model.js';
import AppAssert from '../util/AppAssert.js';
import mongoose from 'mongoose';

export class ClassService {
    // Create a new class
    static async createClass(classData: Partial<ClassDocument>) {
        // Validate trainer and facility exist
        const trainerExists = await mongoose.model('User').findById(classData.trainer);
        AppAssert(trainerExists, 404, 'Trainer not found');

        const facilityExists = await mongoose.model('Facility').findById(classData.facility);
        AppAssert(facilityExists, 404, 'Facility not found');

        const classInstance = new ClassModel(classData);
        await classInstance.save();

        // Populate references
        await classInstance.populate(['trainer', 'facility']);

        return classInstance;
    }

    // Get all classes
    static async getClasses() {
        return await ClassModel.find({ status: 'active' })
            .populate('trainer', 'name email')
            .populate('facility', 'name type location')
            .sort({ 'schedule.day': 1, 'schedule.startTime': 1 });
    }

    // Get class by ID
    static async getClassById(id: string) {
        const classInstance = await ClassModel.findById(id)
            .populate('trainer', 'name email')
            .populate('facility', 'name type location');

        AppAssert(classInstance, 404, 'Class not found'); // ✅ Correct order

        return classInstance;
    }

    // Update class
    static async updateClass(id: string, updateData: Partial<ClassDocument>) {
        if (updateData.trainer) {
            const trainerExists = await mongoose.model('User').findById(updateData.trainer);
            AppAssert(trainerExists, 404, 'Trainer not found');
        }

        if (updateData.facility) {
            const facilityExists = await mongoose.model('Facility').findById(updateData.facility);
            AppAssert(facilityExists, 404, 'Facility not found');
        }

        const classInstance = await ClassModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
        .populate('trainer', 'name email')
        .populate('facility', 'name type location');

        AppAssert(classInstance, 404, 'Class not found');

        return classInstance;
    }

    // Delete class
    static async deleteClass(id: string) {
        const classInstance = await ClassModel.findByIdAndDelete(id);
        AppAssert(classInstance, 404, 'Class not found');

        return { message: 'Class deleted successfully' };
    }
}
