import mongoose from 'mongoose';

export interface ClassDocument extends mongoose.Document {
    name: string;
    description: string;
    type: string;
    duration: number; // in minutes
    maxCapacity: number;
    trainer: mongoose.Types.ObjectId;
    facility: mongoose.Types.ObjectId;
    schedule: {
        day: string;
        startTime: string;
        endTime: string;
    };
    price: number;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

const classSchema = new mongoose.Schema<ClassDocument>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['yoga', 'pilates', 'zumba', 'spinning', 'crossfit', 'strength', 'cardio', 'other'],
        default: 'other'
    },
    duration: {
        type: Number,
        required: true,
        min: 15,
        max: 180
    },
    maxCapacity: {
        type: Number,
        required: true,
        min: 1,
        max: 50
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    facility: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: true
    },
    schedule: {
        day: {
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

const ClassModel = mongoose.model<ClassDocument>("Class", classSchema);
export default ClassModel;
