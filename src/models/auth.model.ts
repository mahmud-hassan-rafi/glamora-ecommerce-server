import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  IUser,
  IAuthModel,
  IToken,
  IUserDocument,
} from "../utils/auth/types.utils";

// profile schema
const profileSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      trim: true,
    },
    avatar: String,
    phone: String,
    dateOfBirth: Date,
  },
  { _id: false },
);

// address schema
const addressSchema = new Schema(
  {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: String,
    postalCode: String,
    country: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const securitySchema = new Schema(
  {
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: Date,
  },
  { _id: false },
);

// use IUserDocument so mongoose knows about the instance methods
const userSchema = new Schema<IUserDocument, IAuthModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    profile: {
      type: profileSchema,
      required: true,
    },

    addresses: [addressSchema],

    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    cart: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    security: {
      type: securitySchema,
      default: {},
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.statics.getHashedPassword = async function (
  password: string,
): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

userSchema.methods.generateAuthToken = function (this: IToken) {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET as string,
  );
};

userSchema.methods.comparePassword = async function (
  this: IUser,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUserDocument, IAuthModel>("user", userSchema);

export default User;
