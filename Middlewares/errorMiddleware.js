const ApiError = require("../utils/apiError");

const errDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const errProd = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") errDev(err, res);
  else {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
      err = new ApiError(
        "Auth token is not provided or is invalid or may be expired",
        401
      );
    errProd(err, res);
  }
};

module.exports = globalError;
