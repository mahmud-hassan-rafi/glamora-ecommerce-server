import { body } from "express-validator";

export const registerValidation = [
  body("profile.firstname")
    .isLength({ min: 3 })
    .withMessage("Firstname must be at least 3 characters"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isStrongPassword({ minLength: 6, minSymbols: 1, minNumbers: 2 })
    .withMessage("min length - 6 & min numarics - 2 & min symbol - 1"),
  body("profile.phone")
    .optional()
    .isNumeric()
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email or password"),
  body("password")
    .isStrongPassword({ minLength: 6, minSymbols: 1, minNumbers: 2 })
    .withMessage("Invalid email or password"),
];
