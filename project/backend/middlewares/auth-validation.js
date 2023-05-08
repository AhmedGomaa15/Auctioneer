const { body } = require("express-validator");

const emailValidation = body("email").isEmail().withMessage("Please enter valid email");

const passwordValidation = body("password").isLength({ min: 8, max: 16 }).withMessage("Password should be between 8-16");

const nameValidation = body("name").isString().notEmpty().withMessage("Please enter valid name");

const courseNameValidation = body("courseName").isString().notEmpty().withMessage("Please enter course name");

module.exports = {
  isEmail: emailValidation,
  isPassword: passwordValidation,
  isName: nameValidation,
  isCourse: courseNameValidation,
};
