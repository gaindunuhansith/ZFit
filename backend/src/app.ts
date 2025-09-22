import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import inventorySupplierRoutes from "./routes/inventorySuppliers.routes.js";
import categoryRoutes from "./routes/inventoryCategory.routes.js";
import itemsRoutes from "./routes/inventoryItems.routes.js";
import stockRoutes from "./routes/inventoryStock.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";  // Added invoice routes
import paymentRoutes from "./routes/payment.routes.js";  // Added payment routes
import payMethodRoutes from "./routes/payMethod.routes.js";  // Added payMethod routes
import refundRoutes from "./routes/refund.routes.js";  // Added refund routes


//creating a express app instance
const app: express.Application = express();

//global middleware
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
app.use('/api/v1/invoices', invoiceRoutes);  // Added invoice routes
app.use('/api/v1/payments', paymentRoutes);  // Added payment routes
app.use('/api/v1/paymethods', payMethodRoutes);  // Added payMethod routes
app.use('/api/v1/refunds', refundRoutes);  // Added refund routes

//API health check
app.get("/", (req: express.Request, res: express.Response) => {  // Changed from app.use to app.get
    res.send("The API is running");
})


export default app;