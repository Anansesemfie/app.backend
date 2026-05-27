import { ObjectId } from "bson";
import HELPERS from "../../utils/helpers";
import { isEmail, isMobilePhone, isStrongPassword } from "validator";
import { UsersTypes } from "./utils";

const Users = (Mongoose: any) => {
  const USER = new Mongoose.Schema({
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Minimum password length is 6 characters"],
      validate: [isStrongPassword, "Password not Strong enough"],
    },
    username: {
      type: String,
      lowercase: true,
      minlength: [2, "Username is too short.."],
      required: [true, "username is required"],
    },
    account: {
      type: Number,
      default: UsersTypes.User,
    },
    active: {
      type: Boolean,
      default: false,
    },
    dp: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      required: false,
      default: "This user is secretive",
    },
    whatsappNumber: {
      type: String,
      required: false,
      default: "",
      validate: {
        validator: (v: string) => v === "" || isMobilePhone(v, "any", { strictMode: true }),
        message: "Please enter a valid phone number in international format (e.g. +233241234567)",
      },
    },
    key: {
      type: String,
      require: false,
    },
    subscription: {
      type: ObjectId,
      required: false,
    },
    organization: {
      type: ObjectId,
      ref: "organization",
    },
    createdAt: {
      type: Date,
      default: HELPERS.currentTime() || Date.now,
    },
  });

  return USER;
};
export default Users;
