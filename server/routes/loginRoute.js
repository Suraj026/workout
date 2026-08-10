import express from "express";
import loginUser from "../controllers/loginController.js";
import User from "../models/userModel.js";
import { loginSchema } from "../schemas/authSchema.js";
import { validate } from "../validators/validate.js";

const loginRouter = express.Router();

loginRouter.post("/login", validate(loginSchema), loginUser);

export default loginRouter;
