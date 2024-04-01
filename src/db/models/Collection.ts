import { ObjectId } from "bson";
import HELPERS from "../../utils/helpers";

const Collection = (Mongoose: any) => {
  return new Mongoose.Schema({
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: String,
    author: {
      type: ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    category: [
      {
        type: ObjectId,
        ref: "category",
        required: [true, "Category is required"],
      },
    ],
    language: {
      type: ObjectId,
      ref: "language",
      required: [true, "Language is required"],
    },
    origin: {
      type: ObjectId,
      ref: "origin",
      required: [true, "Origin is required"],
    },
    comments: [
      {
        user: ObjectId,
        comment: String,
        moment: {
          type: Date,
          default: HELPERS.currentTime(),
        },
      },
    ],
  });
};

export default Collection;
