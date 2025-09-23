import { Request, Response } from 'express';
import TrainerModel, { TrainerDocument } from '../models/trainer.model.js';
import { AppError } from '../util/AppError.js';
import mongoose from 'mongoose';

export class TrainerService {
    // Create a new trainer
    static async createTrainer(trainerData: Partial<TrainerDocument>) {
        try {
            // Validate user exists
            const userExists = await mongoose.model('User').findById(trainerData.userId);
            if (!userExists) {
                throw new AppError('User not found', 404);
            }

            // Check if user is already a trainer
            const existingTrainer = await TrainerModel.findOne({ userId: trainerData.userId });
            if (existingTrainer) {
                throw new AppError('User is already registered as a trainer', 400);
            }

            const trainer = new TrainerModel(trainerData);
            await trainer.save();
            
            // Populate user reference
            await trainer.populate('userId', 'name email');
            
            return trainer;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message, 400);
        }
    }

    // Get all trainers
    static async getTrainers() {
        try {
            const trainers = await TrainerModel.find({ status: 'active' })
                .populate('userId', 'name email')
                .sort({ createdAt: -1 });
            
            return trainers;
        } catch (error: any) {
            throw new AppError(error.message, 500);
        }
    }

    // Get trainer by ID
    static async getTrainerById(id: string) {
        try {
            const trainer = await TrainerModel.findById(id)
                .populate('userId', 'name email');
                
            if (!trainer) {
                throw new AppError('Trainer not found', 404);
            }
            return trainer;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError('Invalid trainer ID', 400);
        }
    }

    // Update trainer
    static async updateTrainer(id: string, updateData: Partial<TrainerDocument>) {
        try {
            const trainer = await TrainerModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).populate('userId', 'name email');
            
            if (!trainer) {
                throw new AppError('Trainer not found', 404);
            }
            
            return trainer;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message, 400);
        }
    }

    // Delete trainer
    static async deleteTrainer(id: string) {
        try {
            const trainer = await TrainerModel.findByIdAndDelete(id);
            if (!trainer) {
                throw new AppError('Trainer not found', 404);
            }
            return { message: 'Trainer deleted successfully' };
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError('Invalid trainer ID', 400);
        }
    }
}