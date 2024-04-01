import { ObjectId } from "bson";
import HELPERS from "../../utils/helpers";

const Session = (Mongoose: any) => {
  const sessions = new Mongoose.Schema({
    user: {
      type: ObjectId,
      required: [true, "User is required"],
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

  return sessions;
};

export default Session;
