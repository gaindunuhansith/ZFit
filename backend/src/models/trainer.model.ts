import mongoose, { Schema, Model, Document } from "mongoose";

// ITrainer: plain input/data type
export interface ITrainer {
  name: string;
  specialization: string;
  status?: "active" | "inactive"; // optional for creation
}

// TrainerDocument: Mongoose Document type
export interface TrainerDocument extends ITrainer, Document {
  createdAt: Date;
  updatedAt: Date;
}

const trainerSchema = new Schema<TrainerDocument>(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model<TrainerDocument>("Trainer", trainerSchema);
