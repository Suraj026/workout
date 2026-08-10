import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";

const signupUser = async (req, res) => {
  // Extract user data from the request body
  const { username, email, password } = req.body;

  // Check if the user already exists in the database
  const existingUser = await User.findOne({ email: email }).exec();
  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  try {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user to the database
    await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Error creating user", 500);
  }

  console.log(201, "User created successfully");
  return res.status(201).json({
    message: "User created successfully",
  });
};

export default signupUser;
