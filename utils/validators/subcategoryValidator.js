const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id"),
  validatorMiddleware,
];

exports.createSubcategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Subcategory required")
    .isLength({ min: 2 })
    .withMessage("Too short Subcategory name")
    .isLength({ max: 32 })
    .withMessage("Too long Subcategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Subcategory must belong to category")
    .isMongoId()
    .withMessage("Invalid category id"),

  validatorMiddleware,
];

exports.updateSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id"),
  validatorMiddleware,
];
