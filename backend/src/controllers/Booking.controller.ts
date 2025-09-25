import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import * as BookingService from "../services/booking.service.js";

// Zod schema
const bookingSchema = z.object({
  memberId: z.string().min(1),
  classId: z.string().min(1),
  trainerId: z.string().min(1),
  facilityId: z.string().min(1),
  scheduledDate: z.string().refine(d => !isNaN(Date.parse(d)), "Invalid date"),
  status: z.enum(["pending","confirmed","cancelled","completed"]).optional()
});

type BookingInput = z.infer<typeof bookingSchema>;

// Create
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: BookingInput = bookingSchema.parse(req.body);

    ["memberId","classId","trainerId","facilityId"].forEach(key => {
      if (!mongoose.Types.ObjectId.isValid(data[key as keyof BookingInput] as string)) {
        throw new Error(`Invalid ${key}`);
      }
    });

    const booking = await BookingService.createBooking({
      memberId: new mongoose.Types.ObjectId(data.memberId),
      classId: new mongoose.Types.ObjectId(data.classId),
      trainerId: new mongoose.Types.ObjectId(data.trainerId),
      facilityId: new mongoose.Types.ObjectId(data.facilityId),
      scheduledDate: new Date(data.scheduledDate),
      status: data.status || "confirmed"
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) { next(err); }
};

// Get All
export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await BookingService.getAllBookings();
    res.status(200).json({ success: true, data: bookings });
  } catch (err) { next(err); }
};

// Get by ID
export const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid Booking ID" });

    const booking = await BookingService.getBookingById(id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    res.status(200).json({ success: true, data: booking });
  } catch (err) { next(err); }
};

// Update
export const updateBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid Booking ID" });

    const data: Partial<BookingInput> = bookingSchema.partial().parse(req.body) as Partial<BookingInput>;

    const updateData: any = {};
    if (data.memberId) updateData.memberId = new mongoose.Types.ObjectId(data.memberId);
    if (data.classId) updateData.classId = new mongoose.Types.ObjectId(data.classId);
    if (data.trainerId) updateData.trainerId = new mongoose.Types.ObjectId(data.trainerId);
    if (data.facilityId) updateData.facilityId = new mongoose.Types.ObjectId(data.facilityId);
    if (data.scheduledDate) {
      updateData.scheduledDate = new Date(data.scheduledDate);
      const cd = new Date(data.scheduledDate);
      cd.setDate(cd.getDate() - 1);
      updateData.cancellationDeadline = cd;
    }
    if (data.status) updateData.status = data.status;

    const booking = await BookingService.updateBooking(id, updateData);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    res.status(200).json({ success: true, data: booking });
  } catch (err) { next(err); }
};

// Delete
export const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid Booking ID" });

    const booking = await BookingService.deleteBooking(id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    res.status(200).json({ success: true, data: booking });
  } catch (err) { next(err); }
};

// Cancel
export const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid Booking ID" });

    const booking = await BookingService.getBookingById(id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    const now = new Date();
    if (booking.cancellationDeadline && now > booking.cancellationDeadline) {
      return res.status(400).json({ success: false, message: "Cancellation deadline passed" });
    }

    const cancelledBooking = await BookingService.updateBooking(id, { status: "cancelled" });
    res.status(200).json({ success: true, data: cancelledBooking, message: "Booking cancelled" });
  } catch (err) { next(err); }
};

// Reschedule
export const rescheduleBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { scheduledDate } = req.body;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid Booking ID" });
    if (!scheduledDate || isNaN(Date.parse(scheduledDate))) return res.status(400).json({ success: false, message: "Invalid scheduledDate" });

    const booking = await BookingService.getBookingById(id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    const now = new Date();
    if (booking.cancellationDeadline && now > booking.cancellationDeadline) {
      return res.status(400).json({ success: false, message: "Reschedule deadline passed" });
    }

    const newDate = new Date(scheduledDate);
    const newDeadline = new Date(newDate);
    newDeadline.setDate(newDate.getDate() - 1);

    const updatedBooking = await BookingService.updateBooking(id, {
      scheduledDate: newDate,
      cancellationDeadline: newDeadline,
      status: "confirmed"
    });

    res.status(200).json({ success: true, data: updatedBooking, message: "Booking rescheduled" });
  } catch (err) { next(err); }
};
