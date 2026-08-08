import Workout from "../models/workoutModel.js";

// CREATE a new workout
export const createWorkout = async (req, res) => {
  const { exerciseName, sets, reps, weight, date, completed } = req.body;
  if (!exerciseName || sets == null || reps == null || weight == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (sets <= 0 || reps <= 0 || weight <= 0) {
    console.log(400, "Sets, reps, and weight must be positive numbers");
    return res
      .status(400)
      .json({ message: "Sets, reps, and weight must be non-negative numbers" });
  }

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
    return res.status(201).json({
      message: "Workout created successfully",
    });
  } catch (error) {
    console.error(500, "Error creating workout");
    return res.status(500).json({
      message: "Error creating workout",
    });
  }
};

// GET all workouts for a specific user
export const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).exec();
    console.log(200, "Workouts fetched successfully");
    return res.status(200).json(workouts);
  } catch (error) {
    console.error(500, "Error fetching workouts");
    return res.status(500).json({
      message: "Error fetching workouts",
    });
  }
};

// GET a specific workout by ID
export const getWorkout = async (req, res) => {
  const workoutId = req.params.id;

  try {
    const workout = await Workout.findById(workoutId).exec();
    if (!workout) {
      console.log(404, "Workout not found");
      return res.status(404).json({
        message: "Workout not found",
      });
    }
    // Check if the workout belongs to the authenticated user
    if (workout.user.toString() !== req.user.id) {
      console.log(403, "Forbidden: You do not have access to this workout");
      return res.status(403).json({
        message: "Forbidden: You do not have access to this workout",
      });
    }
    // Return the workout
    console.log(200, "Workout fetched successfully");
    return res.status(200).json(workout);
  } catch (error) {
    console.error(500, "Error fetching workout");
    return res.status(500).json({
      message: "Error fetching workout",
    });
  }
};

// PUT (update) a specific workout by ID
export const updateWorkout = async (req, res) => {
  const workoutId = req.params.id;

  // check if the workout exists and belongs to the authenticated user
  try {
    const workout = await Workout.findById(workoutId).exec();
    if (!workout) {
      console.log(404, "Workout not found");
      return res.status(404).json({
        message: "Workout not found",
      });
    }
    if (workout.user.toString() !== req.user.id) {
      console.log(403, "Forbidden: You do not have access to this workout");
      return res.status(403).json({
        message: "Forbidden: You do not have access to this workout",
      });
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
    console.error(500, "Error updating workout");
    return res.status(500).json({
      message: "Error updating workout",
    });
  }
};

// DELETE a specific workout by ID
export const deleteWorkout = async (req, res) => {
  const workoutId = req.params.id;

  // check if the workout exists and belongs to the authenticated user
  try {
    const workout = await Workout.findById(workoutId).exec();
    if (!workout) {
      console.log(404, "Workout not found");
      return res.status(404).json({
        message: "Workout not found",
      });
    }
    if (workout.user.toString() !== req.user.id) {
      console.log(403, "Forbidden: You do not have access to this workout");
      return res.status(403).json({
        message: "Forbidden: You do not have access to this workout",
      });
    }

    // Delete the workout
    await Workout.findByIdAndDelete(workoutId);
    console.log(200, "Workout deleted successfully");
    return res.status(200).json({
      message: "Workout deleted successfully",
    });
  } catch (error) {
    console.error(500, "Error deleting workout");
    return res.status(500).json({
      message: "Error deleting workout",
    });
  }
};
