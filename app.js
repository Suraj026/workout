import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/route.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
await connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use("/", router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
