import { Booking, type IBooking } from "../models/booking.model.js";
import mongoose from "mongoose";

// Create Booking
export const createBooking = async (data: IBooking) => {
  data.cancellationDeadline = new Date(data.scheduledDate);
  data.cancellationDeadline.setDate(data.scheduledDate.getDate() - 1);
  return await Booking.create(data);
};

// Get all bookings
export const getAllBookings = async () => {
  return await Booking.find()
    .populate("memberId")
    .populate("classId")
    .populate("trainerId")
    .populate("facilityId");
};

// Get by ID
export const getBookingById = async (id: string) => {
  return await Booking.findById(id)
    .populate("memberId")
    .populate("classId")
    .populate("trainerId")
    .populate("facilityId");
};

// Update Booking
export const updateBooking = async (id: string, data: Partial<IBooking>) => {
  return await Booking.findByIdAndUpdate(id, data, { new: true })
    .populate("memberId")
    .populate("classId")
    .populate("trainerId")
    .populate("facilityId");
};

// Delete Booking
export const deleteBooking = async (id: string) => {
  return await Booking.findByIdAndDelete(id);
};
