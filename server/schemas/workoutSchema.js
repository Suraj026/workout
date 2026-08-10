import { z } from "zod";

export const createWorkoutSchema = z.object({
  exerciseName: z.string().min(1, "Please provide exercise name"),
  sets: z.number().min(1, "Sets cannot be a non-negative number"),
  reps: z.number().min(1, "Reps cannot be a non-negative number"),
  weight: z.number().min(0, "Weights cannot be negative").optional(),
  date: z.iso.date().default(() => {
    return new Date().toISOString().split("T")[0];
  }),
  completed: z.boolean().default(false),
});

export const updateWorkoutSchema = createWorkoutSchema.partial();
