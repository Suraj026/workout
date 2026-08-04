import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

const authRouter = express.Router();

/* Signup route */

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
    res.status(500).json({
      message: "Error creating user",
    });
  }

  res.send({
    message: "User created successfully",
    username: username,
    email: email,
  });
});

export default authRouter;
