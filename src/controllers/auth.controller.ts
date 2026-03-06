import { Response, RequestHandler } from "express";
import { IUser, IAuthRequest, IUserDocument } from "../utils/auth/types.utils";
import { createUser } from "../services/auth.service";
import User from "../models/auth.model";
import Blacklist from "../models/Blacklist.model";

const isProd = ((process.env.NODE_ENV as string) === "production" ||
  (process.env.VERCEL as string)) as boolean;

// register contoller
export const RegisterController: RequestHandler = async (
  req,
  res,
): Promise<Response> => {
  const payload: IUser = req.body;
  const { email } = payload;

  const isUser = await User.findOne({ email });

  if (isUser) {
    return res
      .status(404)
      .json({ success: false, message: "use another email" });
  }

  try {
    const newUser = await createUser(payload);

    const token = newUser.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 86400 * 7,
      secure: isProd, // prod এ true
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    return res.status(201).json({ success: true, message: "account created!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

// login controller
export const LoginController: RequestHandler = async (
  req,
  res,
): Promise<Response> => {
  try {
    const { email, password, role } = req.body;

    // checking for any field missing
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "all fields are required" });
    }

    // if all field is available then we can find user;
    const user = await User.findOne<IUserDocument>({ email }).select(
      "+password",
    );

    // if no user return error
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // also if the role is not match then also return the error
    if (user.role !== role) {
      return res.status(401).json({
        message: "Invalid email or password -> role mismatched",
        navigate: `${user.role === "admin" ? "/admin/login" : "/login"}`,
      });
    }

    // we got a user with this email now time to checking for is the password matched or not
    const isPasswordMatched = await user.comparePassword(password);

    // if password not matched then you are not allowed
    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      // yeah! password matched. not time genrate token in cookiee for auto login next time - authorization
      const token = user.generateAuthToken();
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 86400 * 7,
        secure: isProd, // prod এ true
        sameSite: isProd ? "none" : "lax",
        path: "/",
      });
    }
  } catch (error) {
    // other error handling
    console.log("Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }

  // at last if all the data is matched then return the success
  return res.status(200).json({
    success: true,
    message: "Login successfull",
  });
};

export const getProfileController: RequestHandler = (req, res) => {
  const authReq = req as IAuthRequest;
  return res.status(200).json({ message: "welcome!", ...authReq.user });
};

// logout controller
export const LogoutController: RequestHandler = async (
  req,
  res,
): Promise<Response> => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });

  const token = req.cookies.token;
  await Blacklist.create({ token: token });

  return res.status(200).json({ message: "Logout done" });
};
