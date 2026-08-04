import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import healthRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
await connectDB();

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

app.use("/health", healthRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
