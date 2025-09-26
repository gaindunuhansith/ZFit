import { Router } from "express";
import * as BookingController from "../controllers/Booking.controller.js";


import classRoutes from "./class.routes.js";       // class-related routes
import facilityRoutes from "./facility.routes.js"; // facility-related routes
import trainerRoutes from "./trainer.routes.js";   // trainer-related routes

const router = Router();

router.post("/", BookingController.createBooking);
router.get("/", BookingController.getAllBookings);
router.get("/:id", BookingController.getBookingById);
router.patch("/:id", BookingController.updateBooking);
router.delete("/:id", BookingController.deleteBooking);



// Classes: /api/v1/bookings/classes/*
router.use("/classes", classRoutes);

// Facilities: /api/v1/bookings/facilities/*
router.use("/facilities", facilityRoutes);

// Trainers: /api/v1/bookings/trainers/*
router.use("/trainers", trainerRoutes);

export default router;
