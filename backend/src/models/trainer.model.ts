import mongoose from 'mongoose';

export interface TrainerDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    specialization: string;
    experience: number; // years
    bio: string;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

const trainerSchema = new mongoose.Schema<TrainerDocument>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    specialization: {
        type: String,
        required: true,
        enum: ['strength_training', 'cardio', 'yoga', 'pilates', 'martial_arts', 'swimming', 'dance', 'nutrition', 'other']
    },
    experience: {
        type: Number,
        required: true,
        min: 0
    },
    bio: {
        type: String,
        required: true,
        maxLength: 500
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

const TrainerModel = mongoose.model<TrainerDocument>("Trainer", trainerSchema);
export default TrainerModel;
