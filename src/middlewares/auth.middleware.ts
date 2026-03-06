import { RequestHandler } from "express";
import Blacklist from "../models/Blacklist.model";
import Auth from "../models/auth.model";
import jwt from "jsonwebtoken";
import { IToken, IAuthRequest } from "../utils/auth/types.utils";
import { validationResult } from "express-validator";

export const isUserAuthenticated: RequestHandler = async (req, res, next) => {
  const authReq = req as IAuthRequest;

  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlacklisted = await Blacklist.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "blacklisted, login again" });
  }

  let decoded: IToken;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as IToken;
  } catch (error) {
    return res.status(401).json({ message: "invalid token" });
  }

  const user = await Auth.findById(decoded._id).lean();

  if (!user || user.isDeleted) {
    return res.status(401).json({ message: "Account deleted or not found" });
  }

  authReq.user = user;
  next();
};

export const validationRequest: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array() });
  }

  next();
};
