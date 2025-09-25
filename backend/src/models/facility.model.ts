import mongoose, { Document, Schema } from "mongoose";

// IFacility: plain input type
export interface IFacility {
  name: string;
  capacity: number; // max people
  status?: "active" | "inactive"; // optional for creation
  equipments?: mongoose.Types.ObjectId[]; // array of equipment references
}

// FacilityDocument: Mongoose Document
export interface FacilityDocument extends IFacility, Document {
  createdAt: Date;
  updatedAt: Date;
}

const facilitySchema = new Schema<FacilityDocument>(
  {
    name: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    equipments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipment" }],
  },
  { timestamps: true }
);

// Optional index
facilitySchema.index({ name: 1 });

export default mongoose.model<FacilityDocument>("Facility", facilitySchema);
