import { ObjectId } from "bson";
import HELPERS from "../../utils/helpers";

const Comments = (Mongoose: any) => {
  return new Mongoose.Schema({
    bookID: {
      type: ObjectId,
      required: [true, "Missing book to comment on"],
    },
    user: {
      type: ObjectId,
      required: [true, "Missing user to comment on book"],
    },
    comment: {
      type: String,
      required: [true, "Comment is empty"],
      maxlength: [100, "Comment too long"],
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

export default Comments;
