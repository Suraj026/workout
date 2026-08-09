const notFoundMiddleware = (req, res, next) => {
  res.status(404).json({
    message: "Page not found!",
  });
};

export default notFoundMiddleware;
