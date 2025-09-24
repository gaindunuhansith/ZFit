import type { Request, Response } from 'express';
import ClassModel, { type ClassDocument } from '../models/class.model.js';
import {AppAssert} from '../util/AppAssert.js';
import mongoose from 'mongoose';

export class ClassService {
    // Create a new class
    static async createClass(classData: Partial<ClassDocument>) {
        try {
            // Validate trainer and facility exist
            const trainerExists = await mongoose.model('User').findById(classData.trainer);
            AppAssert(trainerExists, 'Trainer not found', 404);

            const facilityExists = await mongoose.model('Facility').findById(classData.facility);
            AppAssert(facilityExists, 'Facility not found', 404);

            const classInstance = new ClassModel(classData);
            await classInstance.save();
            
            // Populate references
            await classInstance.populate(['trainer', 'facility']);
            
            return classInstance;
        } catch (error: any) {
            throw error; // AppAssert already throws structured errors
        }
    }

    // Get all classes
    static async getClasses() {
        const classes = await ClassModel.find({ status: 'active' })
            .populate('trainer', 'name email')
            .populate('facility', 'name type location')
            .sort({ 'schedule.day': 1, 'schedule.startTime': 1 });
        
        return classes;
    }

    // Get class by ID
    static async getClassById(id: string) {
        const classInstance = await ClassModel.findById(id)
            .populate('trainer', 'name email')
            .populate('facility', 'name type location');
        
        AppAssert(classInstance, 'Class not found', 404);

        return classInstance;
    }

    // Update class
    static async updateClass(id: string, updateData: Partial<ClassDocument>) {
        if (updateData.trainer) {
            const trainerExists = await mongoose.model('User').findById(updateData.trainer);
            AppAssert(trainerExists, 'Trainer not found', 404);
        }

        if (updateData.facility) {
            const facilityExists = await mongoose.model('Facility').findById(updateData.facility);
            AppAssert(facilityExists, 'Facility not found', 404);
        }

        const classInstance = await ClassModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
        .populate('trainer', 'name email')
        .populate('facility', 'name type location');
        
        AppAssert(classInstance, 'Class not found', 404);

        return classInstance;
    }

    // Delete class
    static async deleteClass(id: string) {
        const classInstance = await ClassModel.findByIdAndDelete(id);
        AppAssert(classInstance, 'Class not found', 404);

        return { message: 'Class deleted successfully' };
    }
}
