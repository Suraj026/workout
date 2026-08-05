import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const loginRouter = express.Router();

loginRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate the user data
  if (!email || !password) {
    return res.status(400).json({
      message: "Missing fields",
    });
  }

  // Check if the user exists in the database
  const existingUser = await User.findOne({ email: email }).exec();

  if (!existingUser) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  // Compare passwords
  try {
    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // return JWT
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT secret is not defined",
      });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful",
      token: token,
      id: existingUser._id,
    });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      message: "Error comparing passwords",
    });
  }
});

export default loginRouter;
