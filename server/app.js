import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import healthRouter from "./routes/healthRoute.js";
import signupRouter from "./routes/signupRoute.js";
import loginRouter from "./routes/loginRoute.js";
import workoutRouter from "./routes/workoutRoute.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorHandler from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
await connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

// Normal routes
app.use("/", healthRouter, signupRouter, loginRouter);

// Protected routes
app.use("/auth", workoutRouter);

// Undefined routes
app.use(notFoundMiddleware);

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
