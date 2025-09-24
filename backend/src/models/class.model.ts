import mongoose, { Document } from 'mongoose';

export interface IClass extends Document {
  name: string;
  type: string;
  duration: number;
  maxCapacity: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new mongoose.Schema<IClass>({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  duration: { type: Number, required: true },
  maxCapacity: { type: Number, required: true },
  status: { type: String, enum: ['active','inactive'], default: 'active' },
}, { timestamps: true }); // automatically adds createdAt & updatedAt

export default mongoose.model<IClass>('Class', classSchema);
