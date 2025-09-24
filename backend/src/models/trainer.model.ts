import mongoose, { Document } from 'mongoose';

export interface ITrainer extends Document {
  name: string;
  specialty: string;
  experience: number; // years of experience
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const trainerSchema = new mongoose.Schema<ITrainer>({
  name: { type: String, required: true, trim: true },
  specialty: { type: String, required: true, trim: true },
  experience: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['active','inactive'], default: 'active' }
}, { timestamps: true }); // adds createdAt & updatedAt

export default mongoose.model<ITrainer>('Trainer', trainerSchema);
