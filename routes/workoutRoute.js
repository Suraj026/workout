import express from "express";
import Workout from "../models/workoutModel.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createWorkout,
  getAllWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workoutController.js";
import { validate } from "../validators/validate.js";
import {
  createWorkoutSchema,
  updateWorkoutSchema,
} from "../schemas/workoutSchema.js";

const workoutRouter = express.Router();

// CREATE a new workout
workoutRouter.post(
  "/create",
  authMiddleware,
  validate(createWorkoutSchema),
  createWorkout,
);

// GET all workouts for a specific user
workoutRouter.get("/workout", authMiddleware, getAllWorkouts);

// GET a specific workout by ID
workoutRouter.get("/workout/:id", authMiddleware, getWorkout);

// PUT (update) a specific workout by ID
workoutRouter.put(
  "/workout/:id",
  authMiddleware,
  validate(updateWorkoutSchema),
  updateWorkout,
);

// DELETE a specific workout by ID
workoutRouter.delete("/workout/:id", authMiddleware, deleteWorkout);

export default workoutRouter;
