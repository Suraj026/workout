import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  // Extract user data from the request body
  const { username, email, password } = req.body;

  // Validate the user data
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Missing fields",
    });
  }

  // Check if the user already exists in the database
  const existingUser = await User.findOne({ email: email }).exec();
  if (existingUser) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await User.create(newUser);
  } catch (error) {
    console.error("Error: ", error);
    return res.status(500).json({
      message: "Error creating user",
    });
  }

  res.status(201).json({
    message: "User created successfully",
  });
});

authRouter.post("/login", async (req, res) => {
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

    const token = jwt.sign(
      { username: existingUser.username, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

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

export default authRouter;
