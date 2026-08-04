import express from "express";

const healthRouter = express.Router();

healthRouter.get("/health", (req, res) => {
  res.send({
    status: "success",
  });
});

export default healthRouter;
