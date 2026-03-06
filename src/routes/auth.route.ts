import express from "express";
import {
  RegisterController,
  LoginController,
  LogoutController,
  getProfileController,
} from "../controllers/auth.controller";
import {
  isUserAuthenticated,
  validationRequest,
} from "../middlewares/auth.middleware";
import {
  loginValidation,
  registerValidation,
} from "../utils/auth/validation.utils";

const router = express.Router();

// use leading slashes on paths
router.post(
  "/register",
  registerValidation,
  validationRequest,
  RegisterController,
);
router.post("/login", loginValidation, validationRequest, LoginController);
router.get("/me", isUserAuthenticated, getProfileController);
router.post("/logout", isUserAuthenticated, LogoutController);

export default router;
