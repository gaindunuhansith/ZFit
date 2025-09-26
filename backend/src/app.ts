import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import membershipRouter from "./routes/membership.routes.js";  // Added membership routes
import subscriptionRouter from "./routes/subscription.routes.js";  // Added subscription routes
import inventoryRoutes from "./routes/inventory.routes.js";  // Consolidated inventory routes
import invoiceRoutes from "./routes/invoice.routes.js";  // Added invoice routes
import paymentRoutes from "./routes/payment.routes.js";  // Added payment routes
import payMethodRoutes from "./routes/payMethod.routes.js";  // Added payMethod routes
import refundRoutes from "./routes/refund.routes.js";  // Added refund routes
import facilityRoutes from "./routes/facility.routes.js";
import classRoutes from "./routes/class.routes.js";
import trainerRoutes from "./routes/trainer.routes.js";
import BookingRoutes from "./routes/Booking.routes.js";
import gatewayRoutes from "./routes/gateway.routes.js";  // Added gateway routes for PayHere
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
app.use('/api/v1/invoices', invoiceRoutes);  // Added invoice routes
app.use('/api/v1/payments', paymentRoutes);  // Added payment routes
app.use('/api/v1/paymethods', payMethodRoutes);  // Added payMethod routes
app.use('/api/v1/refunds', refundRoutes);  // Added refund routes
app.use('/api/v1/gateways', gatewayRoutes);  // Added gateway routes for PayHere
app.use('/api/v1/facilities', facilityRoutes);
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/trainers', trainerRoutes);
app.use('/api/v1/bookings', BookingRoutes);






app.use(errorMiddleware);

export default app;