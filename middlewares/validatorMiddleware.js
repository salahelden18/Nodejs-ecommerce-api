const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
    // return next(new AppError(errors.array()[0].msg, 400));
  }
  next();
};

module.exports = validatorMiddleware;
