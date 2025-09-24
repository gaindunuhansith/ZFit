import { Router } from "express";
import { BookingController } from "../controllers/Booking.controller.js";

const router = Router();

// Standard CRUD routes
router.post("/", BookingController.createBooking);          // Create booking
router.get("/", BookingController.getBookings);            // Get all bookings (optionally filter by member)
router.get("/:id", BookingController.getBookingById);      // Get booking by ID
router.put("/:id", BookingController.updateBooking);       // Update booking (reschedule or status)
router.delete("/:id", BookingController.deleteBooking);    // Delete booking

// Special actions
router.post("/:id/cancel", BookingController.cancelBooking);       // Cancel booking
router.post("/:id/reschedule", BookingController.rescheduleBooking); // Reschedule booking

export default router;
