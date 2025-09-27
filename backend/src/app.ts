import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.routes.js";  
import membershipPlanRouter from "./routes/membershipPlan.routes.js";  
import membershipRouter from "./routes/membership.routes.js";  
import inventoryRoutes from "./routes/inventory.routes.js";  
import paymentRoutes from "./routes/payment.routes.js";  
import BookingRoutes from "./routes/Booking.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import nutritionRoutes from "./routes/nutrition.routes.js";
import goalRoutes from "./routes/goal.routes.js";
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
app.use("/api/v1/users", userRouter);  
app.use("/api/v1/membership-plans", membershipPlanRouter);  
app.use("/api/v1/memberships", membershipRouter);  
app.use('/api/v1/inventory', inventoryRoutes);  
app.use('/api/v1/payments', paymentRoutes);  
app.use('/api/v1/bookings', BookingRoutes);
app.use('/api/v1/progress', progressRoutes);
app.use('/api/v1/workouts', workoutRoutes);
app.use('/api/v1/nutrition', nutritionRoutes);
app.use('/api/v1/goals', goalRoutes);

app.use(errorMiddleware);

export default app;