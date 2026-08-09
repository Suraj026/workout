import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const signupUser = async (req, res) => {
  // Extract user data from the request body
  const { username, email, password } = req.body;

  // Check if the user already exists in the database
  const existingUser = await User.findOne({ email: email }).exec();
  if (existingUser) {
    console.log(409, "User already exists");
    return res.status(409).json({
      message: "User already exists",
    });
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
    console.error(500, "Error creating user");
    return res.status(500).json({
      message: "Error creating user",
    });
  }

  console.log(201, "User created successfully");
  return res.status(201).json({
    message: "User created successfully",
  });
};

export default signupUser;
