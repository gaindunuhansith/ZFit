import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { BookingService } from "../services/booking.service.js";

// Define typed params for routes that use :id
interface BookingParams {
  id: string;
}

export class BookingController {
  // Create a new booking
  static async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.createBooking(req.body);
      res.status(201).json({ success: true, data: booking, message: "Booking created" });
    } catch (error: any) {
      next(error);
    }
  }

  // Get all bookings
  static async getBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const bookings = await BookingService.getBookings();
      res.status(200).json({ success: true, data: bookings });
    } catch (error: any) {
      next(error);
    }
  }

  // Get booking by ID
  static async getBookingById(req: Request<BookingParams>, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid booking ID" });
      }

      const booking = await BookingService.getBookingById(id);
      if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      res.status(200).json({ success: true, data: booking });
    } catch (error: any) {
      next(error);
    }
  }

  // Update booking by ID
  static async updateBooking(req: Request<BookingParams>, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid booking ID" });
      }

      const updatedBooking = await BookingService.updateBooking(id, req.body);
      if (!updatedBooking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      res.status(200).json({ success: true, data: updatedBooking, message: "Booking updated" });
    } catch (error: any) {
      next(error);
    }
  }

  // Delete booking by ID
  static async deleteBooking(req: Request<BookingParams>, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid booking ID" });
      }

      const result = await BookingService.deleteBooking(id);
      if (!result) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }

      res.status(200).json({ success: true, message: "Booking deleted successfully" });
    } catch (error: any) {
      next(error);
    }
  }
}
