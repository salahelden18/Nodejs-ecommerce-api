const AppError = require("../utils/AppError");

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const handleJwtInvalidSignature = () =>
  new AppError("Invalid Token, Please login again", 401);

const handleJwtExpired = () =>
  new AppError("Expired Token, Please login again", 401);

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else {
    const error = { ...err };

    if (err.name === "jsonwebtokenError") error = handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") error = handleJwtExpired();

    sendProdError(error, res);
  }
};

module.exports = globalErrorHandler;
