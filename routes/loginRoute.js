import express from "express";
import loginUser from "../controllers/loginController.js";
import User from "../models/userModel.js";

const loginRouter = express.Router();

loginRouter.post("/login", loginUser);

export default loginRouter;
