import { ObjectId } from "bson";
import HELPERS from "../../utils/helpers";
import { isEmail, isStrongPassword } from "validator";
import bcrypt from "bcrypt";

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
      type: String,
      required: [true, "Please Select account type"],
    },
    active: {
      type: Boolean,
      default: false,
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
    verificationCode:{
      type:String,
      require: true,
    },
    verified:{
      type: Boolean,
      require: false,
      default: false
    },
    createdAt: {
      type: Date,
      default: HELPERS.currentTime(),
    },
  });

  // USER.pre("save", async function (next: () => void) {
    
  //   try {
  //     const user = this; // Reference to the document being saved
  //     const salt = await bcrypt.genSalt();
  //     user.password = await bcrypt.hash(user.password, salt);
  //     next();
  //   } catch (error) {
  //     next(error);
  //   }
  // });

  USER.pre("update", async function (next: () => void) {
    const salt = await bcrypt.genSalt();

    USER.password = await bcrypt.hash(USER.password, salt);

    next();
  });

  return USER;
};
export default Users;