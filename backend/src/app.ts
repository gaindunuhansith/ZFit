import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import inventorySupplierRoutes from "./routes/inventorySuppliers.routes.js";
import categoryRoutes from "./routes/inventoryCategory.routes.js";
import itemsRoutes from "./routes/inventoryItems.routes.js";
import stockRoutes from "./routes/inventoryStock.routes.js";
import inventoryReportRoutes from "./routes/inventoryReport.routes.js";  // Added inventory report routes
import invoiceRoutes from "./routes/invoice.routes.js";  // Added invoice routes
import paymentRoutes from "./routes/payment.routes.js";  // Added payment routes
import payMethodRoutes from "./routes/payMethod.routes.js";  // Added payMethod routes
import refundRoutes from "./routes/refund.routes.js";  // Added refund routes
import recurringPaymentRoutes from "./routes/recurringPayment.routes.js";  // Added recurring payment routes
import gatewayRoutes from "./routes/gateway.routes.js";  // Added gateway routes for PayHere
import paymentReportRoutes from "./routes/paymentReport.routes.js";  // Added payment report routes
import cartRoutes from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js"


//creating a express app instance
const app: express.Application = express();

//global middleware
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use('/api/v1/inventory', categoryRoutes);
app.use("/api/v1/suppliers", inventorySupplierRoutes);
app.use("/api/v1/auth", authRouter);
app.use('/api/v1/inventory', itemsRoutes);
app.use('/api/v1/stock', stockRoutes);
app.use('/api/v1/inventory/reports', inventoryReportRoutes);  // Added inventory report routes
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/invoices', invoiceRoutes);  // Added invoice routes
app.use('/api/v1/payments', paymentRoutes);  // Added payment routes
app.use('/api/v1/paymethods', payMethodRoutes);  // Added payMethod routes
app.use('/api/v1/refunds', refundRoutes);  // Added refund routes
app.use('/api/v1/recurring-payments', recurringPaymentRoutes);  // Added recurring payment routes
app.use('/api/v1/gateways', gatewayRoutes);  // Added gateway routes for PayHere
app.use('/api/v1/reports', paymentReportRoutes);  // Added payment report routes
app.use('/api/v1/analytics', paymentReportRoutes);  // Added payment analytics routes


//API health check
app.get("/", (req: express.Request, res: express.Response) => {  // Changed from app.use to app.get
    res.send("The API is running - PayHere Integration Ready");
})


export default app;