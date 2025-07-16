import { ObjectId } from "bson";
import HELPERS from "../../utils/helpers";

const Reaction = (Mongoose: any) => {
  return new Mongoose.Schema({
    bookID: {
      type: ObjectId,
      required: [true, "Missing book to react"],
    },
    user: {
      type: ObjectId,
      required: [true, "Missing to react to book"],
    },
    action: {
      type: String,
      default: "Like",
    },
    period: {
      type: ObjectId,
      ref: "period",
      required: [true, "Period is required"],
    },
    createdAt: {
      type: Date,
      default: HELPERS.currentTime(),
    },
    deletedAt: {
      type: String,
    },
  });
};

export default Reaction;
