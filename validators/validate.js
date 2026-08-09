import { z } from "zod";

export const validate = (schema) => {
  return (req, res, next) => {
    // Parse the body to validate
    const result = schema.safeParse(req.body);

    if (!result.success) {
      console.error(400, "Validation failed");
      return res.status(400).json({
        message: "Validation failed",
        errors: z.prettifyError(result.error),
      });
    }

    // Replace with validated data
    req.body = result.data;
    next();
  };
};
