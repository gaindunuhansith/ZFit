import mongoose, { Schema } from "mongoose";

export interface IBooking {
  _id?: mongoose.Types.ObjectId;
  memberId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  trainerId: mongoose.Types.ObjectId;
  facilityId: mongoose.Types.ObjectId;
  scheduledDate: Date;
  cancellationDeadline?: Date;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    trainerId: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
    facilityId: { type: Schema.Types.ObjectId, ref: "Facility", required: true },
    scheduledDate: { type: Date, required: true },
    cancellationDeadline: { type: Date },
    status: { type: String, enum: ["pending","confirmed","cancelled","completed"], default: "confirmed", index: true }
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
