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
    played: {
      type: Boolean,
      default: false,
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
