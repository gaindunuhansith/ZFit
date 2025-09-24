import mongoose, { Schema, Document } from "mongoose";

export interface IFacility extends Document {
  name: string;
  capacity: number;
  status: "active" | "inactive";
  equipments: string[]; // references to Equipment IDs
  createdAt: Date;
  updatedAt: Date;
}

const FacilitySchema: Schema = new Schema<IFacility>({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  equipments: [{ type: Schema.Types.ObjectId, ref: "Equipment" }]
}, { timestamps: true });

export default mongoose.model<IFacility>("Facility", FacilitySchema);
