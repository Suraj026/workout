import AppError from "../utils/appError.js";
import Workout from "../models/workoutModel.js";

// CREATE a new workout
export const createWorkout = async (req, res) => {
  const { exerciseName, sets, reps, weight, date, completed } = req.body;

  // Create a new workout object
  const newWorkout = {
    exerciseName,
    sets,
    reps,
    weight,
    date,
    completed,
    user: req.user.id,
  };

  try {
    // Save the new workout to the database
    await Workout.create(newWorkout);
    console.log(201, "Workout created successfully");
    return res.status(201).json(newWorkout);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Error creating workout", 500);
  }
};

// GET all workouts for a specific user
export const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).exec();
    console.log(200, "Workouts fetched successfully");
    return res.status(200).json(workouts);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Error fetching workouts", 500);
  }
};

// GET a specific workout by ID
export const getWorkout = async (req, res) => {
  const workoutId = req.params.id;

  try {
    const workout = await Workout.findById(workoutId).exec();
    if (!workout) {
      throw new AppError("Workout not found", 404);
    }

    // Check if the workout belongs to the authenticated user
    if (workout.user.toString() !== req.user.id) {
      throw new AppError(
        "Forbidden: You do not have access to this workout",
        403,
      );
    }

    // Return the workout
    console.log(200, "Workout fetched successfully");
    return res.status(200).json(workout);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Error fetching workout", 500);
  }
};

// PUT (update) a specific workout by ID
export const updateWorkout = async (req, res) => {
  const workoutId = req.params.id;

  // check if the workout exists and belongs to the authenticated user
  try {
    const workout = await Workout.findById(workoutId).exec();
    if (!workout) {
      throw new AppError("Workout not found", 404);
    }
    if (workout.user.toString() !== req.user.id) {
      throw new AppError(
        "Forbidden: You do not have access to this workout",
        403,
      );
    }

    // Update the workout with the new data
    const updatedWorkout = await Workout.findByIdAndUpdate(
      workoutId,
      req.body,
      { returnDocument: "after" },
    );
    console.log(200, "Workout updated successfully");
    return res.status(200).json(updatedWorkout);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Error updating workout", 500);
  }
};

// DELETE a specific workout by ID
export const deleteWorkout = async (req, res) => {
  const workoutId = req.params.id;

  // check if the workout exists and belongs to the authenticated user
  try {
    const workout = await Workout.findById(workoutId).exec();
    if (!workout) {
      throw new AppError("Workout not found", 404);
    }
    if (workout.user.toString() !== req.user.id) {
      throw new AppError(
        "Forbidden: You do not have access to this workout",
        403,
      );
    }

    // Delete the workout
    await Workout.findByIdAndDelete(workoutId);
    console.log(200, "Workout deleted successfully");
    return res.status(200).json({
      message: "Workout deleted successfully",
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Error deleting workout", 500);
  }
};
