import { ObjectId } from "bson";
import HELPERS from "../../utils/helpers.js";

const chapters = (Mongoose: any) => {
  return new Mongoose.Schema(
    {
      title: {
        type: String,
        default: "A chapter without name",
      },
      description: {
        type: String,
      },
      file: {
        type: String,
      },
      mimetype: {
        type: String,
      },
      book: {
        type: ObjectId,
        required: [true, "Missing Book"],
      },
      moment: {
        type: Date,
        default: HELPERS.currentTime(),
      },
    },
    {
      timestamp: true,
    }
  );
};

export default chapters;
