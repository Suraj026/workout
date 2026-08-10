// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.statusCode, err.message);
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorHandler;
