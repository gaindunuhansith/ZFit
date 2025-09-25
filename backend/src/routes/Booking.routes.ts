import { Router } from "express";
import * as BookingController from "../controllers/Booking.controller.js";

const router = Router();

router.post("/", BookingController.createBooking);
router.get("/", BookingController.getAllBookings);
router.get("/:id", BookingController.getBookingById);
router.patch("/:id", BookingController.updateBooking);
router.delete("/:id", BookingController.deleteBooking);

// Member-specific actions
router.post("/:id/cancel", BookingController.cancelBooking);
router.post("/:id/reschedule", BookingController.rescheduleBooking);

export default router;
