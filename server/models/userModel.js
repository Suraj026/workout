import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the user schema
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

// Create the User model
const User = mongoose.model("User", userSchema);
export default User;
