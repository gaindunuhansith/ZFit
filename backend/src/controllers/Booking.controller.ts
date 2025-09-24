import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
import * as BookingService from "../services/booking.service.js";
import type { IBooking } from "../models/Booking.model.js";

interface BookingParams { id: string }

export class BookingController {

  // CREATE BOOKING
  static async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        member: z.string().min(1, "Member ID is required"),
        class: z.string().optional(),
        trainer: z.string().optional(),
        facility: z.string().optional(),
        bookingDate: z.preprocess(
          (v) => {
            if (typeof v === "string" || v instanceof Date) return new Date(v);
          },
          z.date({ required_error: "Booking date is required", invalid_type_error: "Invalid date format" })
        )
      }).refine(val => !!(val.class || val.trainer || val.facility), {
        message: "Provide at least class, trainer or facility"
      });

      const validated = schema.parse(req.body);

      const cancellationDeadline = new Date(validated.bookingDate.getTime() - 24 * 60 * 60 * 1000);

      const payload: Omit<IBooking, "createdAt" | "updatedAt"> & {
        class?: string;
        trainer?: string;
        facility?: string;
      } = {
        member: validated.member,
        class: validated.class,
        trainer: validated.trainer,
        facility: validated.facility,
        bookingDate: validated.bookingDate,
        cancellationDeadline,
        status: "booked"
      };

      const created = await BookingService.createBooking(payload);
      res.status(201).json({ success: true, data: created });

    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ success: false, errors: err.flatten() });
      next(err);
    }
  }

  // GET ALL BOOKINGS
  static async getBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const memberId = req.query.member as string | undefined;
      const data = memberId
        ? await BookingService.getBookingsByMember(memberId)
        : await BookingService.getBookings();
      res.status(200).json({ success: true, data });
    } catch (err) { next(err); }
  }

  // GET BOOKING BY ID
  static async getBookingById(req: Request<BookingParams>, res: Response, next: NextFunction) {
    try {
      const item = await BookingService.getBookingById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: "Booking not found" });
      res.status(200).json({ success: true, data: item });
    } catch (err) { next(err); }
  }

  // UPDATE BOOKING
  static async updateBooking(req: Request<BookingParams>, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        class: z.string().optional(),
        trainer: z.string().optional(),
        facility: z.string().optional(),
        bookingDate: z.preprocess((v) => v ? new Date(v as string) : undefined, z.date().optional()),
        status: z.enum(["booked", "cancelled", "rescheduled", "completed"]).optional()
      });

      const validated = schema.parse(req.body);

      // If cancelling, enforce cancellation deadline
      if (validated.status === "cancelled") {
        const existing = await BookingService.getBookingById(req.params.id);
        if (!existing) return res.status(404).json({ success: false, message: "Booking not found" });
        if (existing.cancellationDeadline.getTime() <= new Date().getTime()) {
          return res.status(400).json({
            success: false,
            message: "Cancellation deadline passed (cannot cancel within 24 hours of booking date)"
          });
        }
      }

      // Update cancellationDeadline if bookingDate changed
      if (validated.bookingDate) {
        validated.cancellationDeadline = new Date(validated.bookingDate.getTime() - 24 * 60 * 60 * 1000);
      }

      const updated = await BookingService.updateBooking(req.params.id, validated);
      if (!updated) return res.status(404).json({ success: false, message: "Booking not found" });
      res.status(200).json({ success: true, data: updated });

    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ success: false, errors: err.flatten() });
      next(err);
    }
  }

  // DELETE BOOKING
  static async deleteBooking(req: Request<BookingParams>, res: Response, next: NextFunction) {
    try {
      const deleted = await BookingService.deleteBooking(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: "Booking not found" });
      res.status(200).json({ success: true, message: "Deleted", data: deleted });
    } catch (err) { next(err); }
  }

  // CANCEL BOOKING
  static async cancelBooking(req: Request<BookingParams>, res: Response, next: NextFunction) {
    try {
      const cancelled = await BookingService.cancelBooking(req.params.id);
      res.status(200).json({ success: true, message: "Booking cancelled", data: cancelled });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // RESCHEDULE BOOKING
  static async rescheduleBooking(req: Request<BookingParams>, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        bookingDate: z.preprocess(
          (v) => new Date(v as string),
          z.date({ required_error: "New booking date is required", invalid_type_error: "Invalid date format" })
        )
      });

      const { bookingDate } = schema.parse(req.body);
      const rescheduled = await BookingService.rescheduleBooking(req.params.id, bookingDate);
      res.status(200).json({ success: true, message: "Booking rescheduled", data: rescheduled });
    } catch (err: any) {
      if (err instanceof z.ZodError) return res.status(400).json({ success: false, errors: err.flatten() });
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
