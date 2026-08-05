import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authMiddleware from "./middleware/authMiddleware.js";
import healthRouter from "./routes/healthRoute.js";
import signupRouter from "./routes/signupRoute.js";
import loginRouter from "./routes/loginRoute.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
await connectDB();

const app = express();
app.use(express.json());

app.use("/", healthRouter, signupRouter, loginRouter);

// Protected routes
app.use("/auth", authMiddleware);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
