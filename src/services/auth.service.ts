import { IUser } from "../utils/auth/types.utils";
import User from "../models/auth.model";

export const createUser = async (payload: IUser) => {
  const hashedPassword = await User.getHashedPassword(payload.password);

  const user = await User.create({
    ...payload,
    password: hashedPassword,
  });

  return user;
};
