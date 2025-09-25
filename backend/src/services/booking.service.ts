import Booking, { type IBooking } from "../models/Booking.model.js";

export default class BookingService {
  async createBooking(data: Partial<IBooking>) {
    return await Booking.create(data);
  }

  async getBookings() {
    return await Booking.find()
      .populate("class")
      .populate("trainer")
      .populate("facility");
  }

  async getBookingsByMember(memberId: string) {
    return await Booking.find({ member: memberId })
      .populate("class")
      .populate("trainer")
      .populate("facility");
  }

  async getBookingById(id: string) {
    return await Booking.findById(id)
      .populate("class")
      .populate("trainer")
      .populate("facility");
  }

  async updateBooking(id: string, data: Partial<IBooking>) {
    return await Booking.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteBooking(id: string) {
    return await Booking.findByIdAndDelete(id);
  }

  async cancelBooking(id: string) {
    const booking = await Booking.findById(id);
    if (!booking) throw new Error("Booking not found");

    const now = new Date();
    if (booking.cancellationDeadline.getTime() <= now.getTime()) {
      throw new Error("Cancellation deadline passed");
    }

    booking.status = "cancelled";
    return await booking.save();
  }

  async rescheduleBooking(id: string, newDate: Date) {
    const booking = await Booking.findById(id);
    if (!booking) throw new Error("Booking not found");

    booking.bookingDate = newDate;
    booking.cancellationDeadline = new Date(newDate.getTime() - 24 * 60 * 60 * 1000);
    booking.status = "rescheduled";

    return await booking.save();
  }
}
