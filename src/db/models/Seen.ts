import { ObjectId } from "bson";
import HELPERS from "../../utils/helpers";

const Seen = (Mongoose: any) => {
  return new Mongoose.Schema({
    bookID: {
      type: ObjectId,
      required: [true, "Book is required"],
    },
    user: {
      type: ObjectId,
      required: [true, "User required"],
    },
    seenAt: {
      type: Date,
      default: Date.now,
    },
    playedAt: {
      type: Date,
    },
    subscription: {
      type: ObjectId,
      required: false,
    },
    createdAt: {
      type: Date,
      default: HELPERS.currentTime(),
    },
  });
};

export default Seen;
