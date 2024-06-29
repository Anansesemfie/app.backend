import { ObjectId } from "bson";
import HELPERS from "../../utils/helpers";
import { isEmail, isStrongPassword } from "validator";
import { UsersTypes } from "./utils";

const Users = (Mongoose: any) => {
  const USER = new Mongoose.Schema({
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is unique"],
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
    verified: {
      type: Boolean,
      default: false
    },
    dp: {
      type: String,
      default: "/images/dp.png",
    },
    bio: {
      type: String,
      required: false,
      default: "This user is secretive",
    },
    key: {
      type: String,
      require: false,
    },
    subscription: {
      type: ObjectId,
      required: false,
    },
    createdAt: {
      type: Date,
      default: HELPERS.currentTime() || Date.now,
    },
  });

  return USER;
};
export default Users;
