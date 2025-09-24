import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  member: string;
  class?: string;
  trainer?: string;
  facility?: string;
  bookingDate: Date;
  cancellationDeadline: Date;
  status: "booked" | "cancelled" | "rescheduled" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema<IBooking>({
  member: { type: String, required: true },
  class: { type: Schema.Types.ObjectId, ref: "Class" },
  trainer: { type: Schema.Types.ObjectId, ref: "Trainer" },
  facility: { type: Schema.Types.ObjectId, ref: "Facility" },
  bookingDate: { type: Date, required: true },
  cancellationDeadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ["booked", "cancelled", "rescheduled", "completed"],
    default: "booked"
  }
}, { timestamps: true });

export default mongoose.model<IBooking>("Booking", BookingSchema);
