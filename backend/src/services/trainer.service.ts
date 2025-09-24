import TrainerModel, { type TrainerDocument } from '../models/Trainer.model.js';
import AppError from '../util/AppError.js';
import { NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../constants/http.js';
import mongoose from 'mongoose';

export class TrainerService {
    // Create a new trainer
    static async createTrainer(data: Partial<TrainerDocument>) {
        try {
            if (!data.userId) throw new AppError(BAD_REQUEST, 'userId is required');

            const exists = await TrainerModel.findOne({ userId: data.userId });
            if (exists) throw new AppError(BAD_REQUEST, 'Trainer already exists for this user');

            const trainer = new TrainerModel(data);
            await trainer.save();
            return trainer;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(BAD_REQUEST, error.message);
        }
    }

    // Get all trainers
    static async getAllTrainers() {
        try {
            return await TrainerModel.find()
                .populate('userId', 'name email')
                .sort({ createdAt: -1 });
        } catch (error: any) {
            throw new AppError(INTERNAL_SERVER_ERROR, error.message);
        }
    }

    // Get trainer by ID
    static async getTrainerById(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new AppError(BAD_REQUEST, 'Invalid trainer ID');
            }

            const trainer = await TrainerModel.findById(id).populate('userId', 'name email');
            if (!trainer) throw new AppError(NOT_FOUND, 'Trainer not found');
            return trainer;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(BAD_REQUEST, error.message);
        }
    }

    // Update trainer
    static async updateTrainer(id: string, data: Partial<TrainerDocument>) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new AppError(BAD_REQUEST, 'Invalid trainer ID');
            }

            const trainer = await TrainerModel.findByIdAndUpdate(id, data, { new: true, runValidators: true })
                .populate('userId', 'name email');

            if (!trainer) throw new AppError(NOT_FOUND, 'Trainer not found');
            return trainer;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(BAD_REQUEST, error.message);
        }
    }

    // Delete trainer
    static async deleteTrainer(id: string) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new AppError(BAD_REQUEST, 'Invalid trainer ID');
            }

            const trainer = await TrainerModel.findByIdAndDelete(id);
            if (!trainer) throw new AppError(NOT_FOUND, 'Trainer not found');
            return trainer;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(BAD_REQUEST, error.message);
        }
    }
}
