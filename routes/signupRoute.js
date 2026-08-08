import express from "express";
import signupUser from "../controllers/signupController.js";
import User from "../models/userModel.js";

const signupRouter = express.Router();

signupRouter.post("/signup", signupUser);

export default signupRouter;
