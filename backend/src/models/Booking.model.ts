import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  memberId: mongoose.Types.ObjectId;
  resourceType: "class" | "trainer" | "equipment" | "gymSession";
  resourceId: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },
  resourceType: {
    type: String,
    enum: ["class", "trainer", "equipment", "gymSession"],
    required: true,
  },
  resourceId: { type: Schema.Types.ObjectId, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBooking>("Booking", BookingSchema);
