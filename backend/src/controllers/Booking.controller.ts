import type { Request, Response } from "express";
import { z } from "zod";
import BookingService from "../services/booking.service.js";

const bookingService = new BookingService();

// ---------------- SCHEMAS ----------------
const createBookingSchema = z.object({
  member: z.string().min(1, "Member ID is required"),
  class: z.string().optional(),
  trainer: z.string().optional(),
  facility: z.string().optional(),
  bookingDate: z.preprocess(
    (v) => (v ? new Date(v as string) : undefined),
    z.date({ invalid_type_error: "Booking date must be a valid date" })
  ),
}).refine(val => !!(val.class || val.trainer || val.facility), "Provide at least class, trainer, or facility");

const bookingIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid booking ID")
});

// ---------------- CONTROLLERS ----------------

// Create booking
export const createBooking = async (req: Request, res: Response) => {
  try {
    const validated = createBookingSchema.parse(req.body);
    const cancellationDeadline = new Date(validated.bookingDate.getTime() - 24*60*60*1000);

    const booking = await bookingService.createBooking({
      ...validated,
      cancellationDeadline,
      status: "booked"
    });

    res.status(201).json({
      success: true,
      message: "Booking created",
      cancellationDeadline,
      data: booking
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get all bookings or by member
export const getBookings = async (req: Request, res: Response) => {
  try {
    const memberId = req.query.member as string | undefined;
    const bookings = memberId 
      ? await bookingService.getBookingsByMember(memberId) 
      : await bookingService.getBookings();

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    handleError(res, error);
  }
};

// Cancel booking (before deadline)
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = bookingIdSchema.parse({ id: req.params.id });
    const booking = await bookingService.getBookingById(id);

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (new Date() > booking.cancellationDeadline)
      return res.status(400).json({ success: false, message: "Cannot cancel after deadline" });

    const cancelled = await bookingService.cancelBooking(id);
    res.status(200).json({ success: true, message: "Booking cancelled", data: cancelled });
  } catch (error) {
    handleError(res, error);
  }
};

// Reschedule booking
export const rescheduleBooking = async (req: Request, res: Response) => {
  try {
    const { id } = bookingIdSchema.parse({ id: req.params.id });
    const booking = await bookingService.getBookingById(id);

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    if (new Date() > booking.cancellationDeadline)
      return res.status(400).json({ success: false, message: "Cannot reschedule after deadline" });

    const { bookingDate } = z.object({
      bookingDate: z.preprocess(v => new Date(v as string), z.date({ invalid_type_error: "Invalid date" }))
    }).parse(req.body);

    const newDeadline = new Date(bookingDate.getTime() - 24*60*60*1000);
    const updated = await bookingService.rescheduleBooking(id, bookingDate, newDeadline);

    res.status(200).json({ success: true, message: "Booking rescheduled", cancellationDeadline: newDeadline, data: updated });
  } catch (error) {
    handleError(res, error);
  }
};

// ---------------- ERROR HANDLER ----------------
const handleError = (res: Response, error: unknown) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      errors: error.issues.map(e => ({ field: e.path.join("."), message: e.message }))
    });
  }
  res.status(500).json({ success: false, message: (error as Error).message || "Server error" });
};
