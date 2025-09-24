import Booking, { type IBooking } from "../models/Booking.model.js";
import mongoose from "mongoose";

export class BookingService {
  // Create booking with conflict check
  static async createBooking(data: Partial<IBooking>) {
    const conflict = await Booking.findOne({
      resourceId: data.resourceId,
      date: data.date,
      startTime: { $lt: data.endTime },
      endTime: { $gt: data.startTime },
    });

    if (conflict) throw new Error("This resource is already booked for the selected time");

    return await Booking.create(data);
  }

  static async getBookings() {
    return await Booking.find().populate("memberId").populate("resourceId");
  }

  static async getBookingById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Booking ID");
    return await Booking.findById(id).populate("memberId").populate("resourceId");
  }

  static async updateBooking(id: string, data: Partial<IBooking>) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Booking ID");
    return await Booking.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteBooking(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Booking ID");
    await Booking.findByIdAndDelete(id);
    return { message: "Booking deleted successfully" };
  }
}
