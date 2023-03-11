const path = require("path");

const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// routes importing
const mountRoutes = require("./routes/index");

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find this route: ${req.originalUrl}`, 400));
});

// global error handling middleware for express
app.use(globalErrorHandler);

module.exports = app;
