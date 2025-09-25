import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import inventoryRoutes from "./routes/inventory.routes.js";  // Consolidated inventory routes
import invoiceRoutes from "./routes/invoice.routes.js";  // Added invoice routes
import paymentRoutes from "./routes/payment.routes.js";  // Added payment routes
import payMethodRoutes from "./routes/payMethod.routes.js";  // Added payMethod routes
import refundRoutes from "./routes/refund.routes.js";  // Added refund routes
import gatewayRoutes from "./routes/gateway.routes.js";  // Added gateway routes for PayHere
import paymentReportRoutes from "./routes/paymentReport.routes.js";  // Added payment report routes
import errorMiddleware from "./middleware/error.middleware.js";


//creating a express app instance
const app: express.Application = express();

//global middleware
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use('/api/v1/inventory', inventoryRoutes);  // Consolidated inventory routes (categories, suppliers, items, stock, reports, cart, orders)
app.use("/api/v1/auth", authRouter);
app.use('/api/v1/invoices', invoiceRoutes);  // Added invoice routes
app.use('/api/v1/payments', paymentRoutes);  // Added payment routes
app.use('/api/v1/paymethods', payMethodRoutes);  // Added payMethod routes
app.use('/api/v1/refunds', refundRoutes);  // Added refund routes
app.use('/api/v1/gateways', gatewayRoutes);  // Added gateway routes for PayHere
app.use('/api/v1/reports', paymentReportRoutes);  // Added payment report routes
app.use('/api/v1/analytics', paymentReportRoutes);  // Added payment analytics routes



app.use(errorMiddleware);

export default app;