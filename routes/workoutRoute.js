import express from "express";
import Workout from "../models/workoutModel.js";
import {
  createWorkout,
  getAllWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workoutController.js";

const workoutRouter = express.Router();

// CREATE a new workout
workoutRouter.post("/create", createWorkout);

// GET all workouts for a specific user
workoutRouter.get("/workout", getAllWorkouts);

// GET a specific workout by ID
workoutRouter.get("/workout/:id", getWorkout);

// PUT (update) a specific workout by ID
workoutRouter.put("/workout/:id", updateWorkout);

// DELETE a specific workout by ID
workoutRouter.delete("/workout/:id", deleteWorkout);

export default workoutRouter;
