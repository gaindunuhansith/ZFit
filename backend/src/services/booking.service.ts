import Booking, { type IBooking } from "../models/Booking.model.js";

// Create
export const createBooking = async (data: Partial<IBooking>) =>
  Booking.create(data);

// Get all
export const getBookings = async () =>
  Booking.find().populate("class trainer facility");

// Get all bookings by member
export const getBookingsByMember = async (memberId: string) =>
  Booking.find({ member: memberId }).populate("class trainer facility");

// Get by ID
export const getBookingById = async (id: string) =>
  Booking.findById(id).populate("class trainer facility");

// Update
export const updateBooking = async (id: string, data: Partial<IBooking>) =>
  Booking.findByIdAndUpdate(id, data, { new: true });

// Delete
export const deleteBooking = async (id: string) =>
  Booking.findByIdAndDelete(id);

// Cancel
export const cancelBooking = async (id: string) => {
  const booking = await Booking.findById(id);
  if (!booking) throw new Error("Booking not found");

  const now = new Date();
  if (booking.cancellationDeadline.getTime() <= now.getTime()) {
    throw new Error("Cancellation deadline passed (cannot cancel within 24 hours of booking date)");
  }

  booking.status = "cancelled";
  return booking.save();
};

// Reschedule
export const rescheduleBooking = async (id: string, newDate: Date) => {
  const booking = await Booking.findById(id);
  if (!booking) throw new Error("Booking not found");

  booking.bookingDate = newDate;
  booking.cancellationDeadline = new Date(newDate.getTime() - 24 * 60 * 60 * 1000);
  booking.status = "rescheduled";

  return booking.save();
};
