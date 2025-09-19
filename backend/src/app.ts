import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import inventorySupplierRoutes from "./routes/inventorySuppliers.routes.js";

//creating a express app instance
const app: express.Application = express();

//global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//API health check
app.use("/api/v1/health", (req: express.Request, res: express.Response) => {
    res.send("The API is running");
})

//routes
app.use("/api/v1/suppliers", inventorySupplierRoutes);


export default app;