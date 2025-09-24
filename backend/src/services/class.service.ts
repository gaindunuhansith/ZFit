import type { Request, Response } from 'express';
import ClassModel, { type ClassDocument } from '../models/class.model.js';
import { type AppError } from '../util/AppError.js';
import mongoose from 'mongoose';

export class ClassService {
    // Create a new class
    static async createClass(classData: Partial<ClassDocument>) {
        try {
            // Validate trainer and facility exist
            const trainerExists = await mongoose.model('User').findById(classData.trainer);
            if (!trainerExists) {
                throw new AppError('Trainer not found', 404);
            }

            const facilityExists = await mongoose.model('Facility').findById(classData.facility);
            if (!facilityExists) {
                throw new AppError('Facility not found', 404);
            }

            const classInstance = new ClassModel(classData);
            await classInstance.save();
            
            // Populate references
            await classInstance.populate(['trainer', 'facility']);
            
            return classInstance;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message, 400);
        }
    }

    // Get all classes
    static async getClasses() {
        try {
            const classes = await ClassModel.find({ status: 'active' })
                .populate('trainer', 'name email')
                .populate('facility', 'name type location')
                .sort({ 'schedule.day': 1, 'schedule.startTime': 1 });
            
            return classes;
        } catch (error: any) {
            throw new AppError(error.message, 500);
        }
    }

    // Get class by ID
    static async getClassById(id: string) {
        try {
            const classInstance = await ClassModel.findById(id)
                .populate('trainer', 'name email')
                .populate('facility', 'name type location');
                
            if (!classInstance) {
                throw new AppError('Class not found', 404);
            }
            return classInstance;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError('Invalid class ID', 400);
        }
    }

    // Update class
    static async updateClass(id: string, updateData: Partial<ClassDocument>) {
        try {
            // If updating trainer or facility, validate they exist
            if (updateData.trainer) {
                const trainerExists = await mongoose.model('User').findById(updateData.trainer);
                if (!trainerExists) {
                    throw new AppError('Trainer not found', 404);
                }
            }

            if (updateData.facility) {
                const facilityExists = await mongoose.model('Facility').findById(updateData.facility);
                if (!facilityExists) {
                    throw new AppError('Facility not found', 404);
                }
            }

            const classInstance = await ClassModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).populate('trainer', 'name email')
             .populate('facility', 'name type location');
            
            if (!classInstance) {
                throw new AppError('Class not found', 404);
            }
            
            return classInstance;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message, 400);
        }
    }

    // Delete class
    static async deleteClass(id: string) {
        try {
            const classInstance = await ClassModel.findByIdAndDelete(id);
            if (!classInstance) {
                throw new AppError('Class not found', 404);
            }
            return { message: 'Class deleted successfully' };
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError('Invalid class ID', 400);
        }
    }
}