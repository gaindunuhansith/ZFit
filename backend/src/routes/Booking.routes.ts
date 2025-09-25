import { Router } from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  cancelBooking,
  rescheduleBooking
} from "../controllers/Booking.controller.js";

const router = Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/:id", getBookingById);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);
router.post("/:id/cancel", cancelBooking);
router.post("/:id/reschedule", rescheduleBooking);

export default router;
