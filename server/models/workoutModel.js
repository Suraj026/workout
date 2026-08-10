import mongoose from "mongoose";
import User from "./userModel.js";

const { Schema } = mongoose;

// workout schema
const workoutSchema = new Schema({
  exerciseName: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Workout = mongoose.model("Workout", workoutSchema);
export default Workout;
