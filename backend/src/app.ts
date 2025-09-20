import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import inventorySupplierRoutes from "./routes/inventorySuppliers.routes.js";
import categoryRoutes from "./routes/inventoryCategory.routes.js";
import itemsRoutes from "./routes/inventoryItems.routes.js";


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
app.use('/api/v1/inventory', itemsRoutes);


//API health check
app.use("/", (req: express.Request, res: express.Response) => {
    res.send("The API is running");
})





export default app;