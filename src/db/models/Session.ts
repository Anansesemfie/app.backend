import { ObjectId } from "bson";
import HELPERS from "../../utils/helpers.js";

const Session = (Mongoose: any) => {
  return new Mongoose.Schema({
    user: {
      type: ObjectId,
      required: [true, "User is required"],
    },
    token: {
      type: String,
      required: [true, "Token is required"],
    },
    duration: {
      type: String,
      default: "2592000000",
    },
    expiredAt: {
      type: Date,
    },
    external: Boolean,
    moment: {
      type: Date,
      default: HELPERS.currentTime(),
    },
  });
};

export default Session;
