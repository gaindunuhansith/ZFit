import mongoose from 'mongoose';

export interface FacilityDocument extends mongoose.Document {
    name: string;
    description: string;
    type: string;
    location: string;
    capacity: number;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

const facilitySchema = new mongoose.Schema<FacilityDocument>({
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
        enum: ['gym', 'pool', 'studio', 'court', 'other'],
        default: 'gym'
    },
    location: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

const FacilityModel = mongoose.model<FacilityDocument>("Facility", facilitySchema);
export default FacilityModel;
