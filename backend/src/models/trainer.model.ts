import mongoose, { Schema, Document } from "mongoose";

export interface ITrainer extends Document {
  name: string;
  specialization: string;
  experience?: number; // in years
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const TrainerSchema: Schema = new Schema<ITrainer>({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, min: 0 }, // optional
  status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

export default mongoose.model<ITrainer>("Trainer", TrainerSchema);
