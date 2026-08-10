import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the database
  const existingUser = await User.findOne({ email: email }).exec();

  if (!existingUser) {
    throw new AppError("Invalid email or password", 401);
  }

  // Compare passwords
  try {
    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!process.env.JWT_SECRET) {
      throw new AppError("JWT secret is not defined", 500);
    }

    // generate token
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // return JWT
    console.log(200, "Login successful");
    return res.status(200).json({
      message: "Login successful",
      token: token,
      id: existingUser._id,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Error comparing passwords", 500);
  }
};

export default loginUser;
