import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import membershipRouter from "./routes/membership.routes.js";  // Added membership routes
import subscriptionRouter from "./routes/subscription.routes.js";  // Added subscription routes
import inventoryRoutes from "./routes/inventory.routes.js";  // Consolidated inventory routes
import paymentRoutes from "./routes/payment.routes.js";  // Consolidated payment routes (payments, invoices, refunds, methods, gateways)
import facilityRoutes from "./routes/facility.routes.js";
import classRoutes from "./routes/class.routes.js";
import trainerRoutes from "./routes/trainer.routes.js";
import BookingRoutes from "./routes/booking.routes.js";
import progressRoutes from "./routes/progress.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";

//creating a express app instance
const app: express.Application = express();

//global middleware
app.use(cookieParser());
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/memberships", membershipRouter);  // Added membership routes
app.use("/api/v1/subscriptions", subscriptionRouter);  // Added subscription routes
app.use('/api/v1/inventory', inventoryRoutes);  // Consolidated inventory routes (categories, suppliers, items, stock, reports, cart, orders)
app.use('/api/v1/payments', paymentRoutes);  // Consolidated payment routes (payments, invoices, refunds, methods, gateways)
app.use('/api/v1/facilities', facilityRoutes);
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/trainers', trainerRoutes);
app.use('/api/v1/bookings', BookingRoutes);
app.use('/api/v1/progress', progressRoutes);

app.use(errorMiddleware);

export default app;