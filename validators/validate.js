import { z } from "zod";

export const validate = (schema) => {
  return (req, res, next) => {
    // Parse the body to validate
    const result = schema.safeParse(req.body);

    if (!result.success) {
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
