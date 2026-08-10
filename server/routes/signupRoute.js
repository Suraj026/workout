import express from "express";
import signupUser from "../controllers/signupController.js";
import User from "../models/userModel.js";
import { validate } from "../validators/validate.js";
import { signupSchema } from "../schemas/authSchema.js";

const signupRouter = express.Router();

signupRouter.post("/signup", validate(signupSchema), signupUser);

export default signupRouter;
