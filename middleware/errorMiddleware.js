// Error handler middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  console.error(statusCode, err.message);
  return res.status(statusCode).json({
    message: err.message,
  });
};
